"""
stylize views
"""
import os
import json
import pickle
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

@api_view(['POST'])
def detect(request, *args, **kwargs):
    """
    Stylizes provided mesh

    Inputs
        :request: <Response.HTTP> a requesting including the mesh specifying the vertices and the faces clusters to seperate mesh into, if None then number  | wbnnnis determined by finding the largest set of eigenvalues 
                         which are within ε away from each other, (default is None)
    
    Outputs
        :returns: <np.ndarray> Materials corresponding to the stylized mesh
    """
    print("in stylize")
    # return Response(data = data, status = stylize_status)
    response = HttpResponse("File Uploaded")
    response.status_code = 200
    return response
    # return Response(data = data, status = True)

