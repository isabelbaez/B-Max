"""
vitals views
"""
import os
import json
import pickle
import subprocess
import base64

from dotenv import load_dotenv
from pathlib import Path
from openai import OpenAI
from rest_framework.decorators import api_view
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt



load_dotenv()
API_KEY = os.getenv('API_KEY')
ORG_KEY = os.getenv('ORG_KEY')
PROJECT_KEY = os.getenv('PROJECT_KEY')

@api_view(['POST'])
def measure(request):

    process_video(request)

    pain_prob = pain_probability()
    print("PAIN: " + str(pain_prob) + "%")

    pulse = heart_rate()
    print("PULSE: " + str(pulse))

    response = HttpResponse("Success")
    response.status_code = 200
    return response


def heart_rate():

    pulse = 80 #TODO: replace with pulse calculation

    #remove video file once we are done with calculation
    current_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.dirname(current_dir)
    media_path = os.path.join(backend_dir, 'media')
    output_path = os.path.join(media_path, 'output.mov')
    os.remove(output_path)

    return pulse

def pain_probability():
    count = 0
    pain_count = 0

    current_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.dirname(current_dir)
    media_path = os.path.join(backend_dir, 'media')
    frames_path = os.path.join(media_path, 'frames')

    client = OpenAI(
        api_key=API_KEY, 
        organization=ORG_KEY,
        project=PROJECT_KEY,
    )

    for filename in os.listdir(frames_path):

        with open(os.path.join(frames_path, filename), 'rb') as f:

            encoded_string = "data:image/jpeg;base64," + base64.b64encode(f.read()).decode('utf-8')

            first_response = client.chat.completions.create(
                model="gpt-4-vision-preview",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": "Yes or no answer: is this face exhibiting pain in their facial expression?"},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": encoded_string,
                                }
                            },
                        ],
                    }
                ],
                max_tokens=300,
            )

            second_response = client.chat.completions.create(
                model="gpt-4-vision-preview",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": "Yes or no answer: is this face exhibiting pain in their facial expression?"},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": encoded_string,
                                }
                            },
                        ],
                    }
                ],
                max_tokens=300,
            )

            pain_1 = first_response.choices[0].message.content
            pain_2 = second_response.choices[0].message.content

            if pain_1 == "Yes.":
                pain_count += 1.5
                count += 1
            elif pain_1 == "No.":
                count += 1
            
            if pain_2 == "Yes.":
                pain_count += 1.5
                count += 1
            elif pain_2 == "No.":
                count += 1
        
        os.remove(os.path.join(frames_path, filename))
    
    
    pain_prob = (pain_count/count)*100
    return pain_prob


@csrf_exempt
def process_video(request):

    with open('input.webm', 'wb') as f:
        f.write(request.body)

    # Get the absolute path to the current directory
    current_dir = os.path.dirname(os.path.abspath(__file__))

    # Get the absolute path to the backend directory (one level above the current directory)
    backend_dir = os.path.dirname(current_dir)
    media_path = os.path.join(backend_dir, 'media')

    input_path = os.path.join(backend_dir, 'input.webm')
    output_path = os.path.join(media_path, 'output.mov')

    # Transcode the video from WebM to MOV format using FFmpeg
    command_mov = ['ffmpeg', '-i', input_path, '-vf', 'minterpolate=fps=30', output_path]
    subprocess.run(command_mov, check=True)

    frames_path = os.path.join(media_path, 'frames')

    if not os.path.exists(frames_path):
        os.makedirs(frames_path)

    output_frame_path = os.path.join(frames_path, "output_%03d.jpg")

    command_frames = ['ffmpeg', '-i', input_path, '-vf', f'fps={1}', output_frame_path]
    subprocess.run(command_frames, check=True)