"""
stylize url patterns
"""
from . import views
from django.urls import path

urlpatterns = [
    path("detect", views.detect, name = "detect"),
]