"""
stylize url patterns
"""
from . import views
from django.urls import path

urlpatterns = [
    path("measure", views.measure, name = "measure"),
]