import subprocess
import json
import speech_recognition as sr
from django.http import HttpResponse

def transcribe(request):
    print("ALOOOO")
    if request.method == 'POST' and 'file' in request.FILES:
        print('entra')
        audio_file = request.FILES['file']
        answer_number = request.POST.get('answer_number')
        print("HWLLOOOO ASNER NUMBER", answer_number)

        # Save the original WebM file temporarily
        temp_webm_path = f'temp_input{answer_number}.webm'
        temp_wav_path = f'temp_output{answer_number}.wav'
        print("y si")
        with open(temp_webm_path, 'wb+') as f:
            for chunk in audio_file.chunks():
                f.write(chunk)

        # Convert WebM to WAV using FFmpeg
        command = ['ffmpeg', '-i', temp_webm_path, '-acodec', 'pcm_s16le', '-ar', '16000', temp_wav_path]
        subprocess.run(command, check=True)

        # Process WAV file with speech recognition
        
        recognizer = sr.Recognizer()
        with sr.AudioFile(temp_wav_path) as source:
            audio_data = recognizer.record(source)
            try:
                text = recognizer.recognize_google(audio_data)
            except sr.UnknownValueError:
                text = "Google Speech Recognition could not understand the audio"
            except sr.RequestError as e:
                text = f"Could not request results from Google Speech Recognition service; {e}"

        # Clean up temporary files
        subprocess.run(['rm', temp_webm_path, temp_wav_path])

        data = {"transcription": text}
        json_data = json.dumps(data)

        response = HttpResponse(json_data)
        response.status_code = 200
        return response
    
    response = HttpResponse('Error: This endpoint only supports POST requests.')
    response.status_code = 405
    return response
