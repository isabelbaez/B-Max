"""
stylize url patterns
"""
from . import views
from django.urls import path

urlpatterns = [
    path("measureVitals", views.measure, name = "measureVitals"),
]