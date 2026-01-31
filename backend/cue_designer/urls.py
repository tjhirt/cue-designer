"""URL configuration for cue_designer project."""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("cues.urls")),
    path("api/", include("cues.api.urls")),
]
