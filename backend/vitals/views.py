"""
stylize views
"""
import os
import json
import pickle
import subprocess
# import clip
# import numpy as np
# from stl import mesh
# import pymeshlab as pml
# from pywavefront import Wavefront
# from rest_framework import status
# from django.shortcuts import render
# from utils.view_helpers import _is_subset
# from rest_framework.response import Response
# from .x2mesh.args import args as x2mesh_args
from rest_framework.decorators import api_view
# from .x2mesh.implementation.main import x2mesh
# from .x2mesh.implementation.utils import device
# from .stylize_utils.view_helpers import _remesh
# from django.views.decorators.csrf import csrf_exempt
# from django.core.files.storage import default_storage
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt


@api_view(['POST'])
def measure(request, *args, **kwargs):

    response = HttpResponse("Success")
    response.status_code = 200
    return response


def heartbeat():

    response = HttpResponse("Success")
    response.status_code = 200
    return response

def pain():

    response = HttpResponse("Success")
    response.status_code = 200
    return response


@csrf_exempt
def transcode_video(request):

    with open('input.webm', 'wb') as f:
        f.write(request.body)

    # Get the absolute path to the current directory
    current_dir = os.path.dirname(os.path.abspath(__file__))

    # Get the absolute path to the backend directory (one level above the current directory)
    backend_dir = os.path.dirname(current_dir)

    input_path = os.path.join(backend_dir, 'input.webm')
    output_path = os.path.join(backend_dir, 'output.mov')

    # Transcode the video from WebM to MOV format using FFmpeg
    command = ['ffmpeg', '-i', input_path, '-vf', 'minterpolate=fps=30', output_path]
    subprocess.run(command, check=True)

    # Send the transcoded MOV video back to the client
    with open('output.mov', 'rb') as f:
        # f.write()
        response = HttpResponse(f.read(), content_type='video/quicktime')
        response['Content-Disposition'] = 'attachment; filename=recorded_video.mov'
        return response