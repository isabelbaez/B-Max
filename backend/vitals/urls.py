"""
stylize url patterns
"""
from . import views
from . import audio_process
from django.urls import path

urlpatterns = [
    path("measureVitals", views.measure, name = "measureVitals"),
    path("processAudio", audio_process.transcribe, name = "processAudio"),
]