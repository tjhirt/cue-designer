from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CueDesignViewSet, CueSectionViewSet
from ..services import cue_svg_profile

router = DefaultRouter()
router.register(r"cues", CueDesignViewSet)
router.register(r"sections", CueSectionViewSet)

urlpatterns = [
    path("v1/", include(router.urls)),
    path("svg/<str:cue_id>/", cue_svg_profile, name="cue-svg-profile"),
]
