from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from cues.models import CueDesign, CueSection
from cues.geometry.core import Point3D, CueSectionGeometry, CueDesignGeometry
from .serializers import (
    CueDesignSerializer,
    CueDesignCreateSerializer,
    CueSectionSerializer,
)


class CueDesignViewSet(viewsets.ModelViewSet):
    """API endpoint for cue designs"""

    queryset = CueDesign.objects.all()
    serializer_class = CueDesignSerializer

    def get_serializer_class(self):
        if self.action == "create":
            return CueDesignCreateSerializer
        return CueDesignSerializer

    @action(detail=True, methods=["get"])
    def geometry(self, request, pk=None):
        """Get geometry validation information"""
        cue_design = self.get_object()

        # Create geometry objects
        sections = []
        for section in cue_design.sections.all():
            start = Point3D(
                section.start_position_in, section.outer_diameter_start_mm / 2
            )
            end = Point3D(section.end_position_in, section.outer_diameter_end_mm / 2)
            sections.append(CueSectionGeometry(section.section_type, start, end))

        geometry = CueDesignGeometry(sections)

        # Get validation results
        continuity_issues = geometry.validate_continuity()
        manufacturing_issues = geometry.validate_manufacturing_constraints()

        return Response(
            {
                "total_length": geometry.total_length,
                "sections_count": len(geometry.sections),
                "continuity_validation": {
                    "valid": len(continuity_issues) == 0,
                    "issues": continuity_issues,
                },
                "manufacturing_validation": {
                    "valid": len(manufacturing_issues) == 0,
                    "issues": manufacturing_issues,
                },
                "sections_by_type": geometry.sections_by_type,
            }
        )

    @action(detail=True, methods=["get"])
    def profile_data(self, request, pk=None):
        """Get profile data for rendering"""
        cue_design = self.get_object()

        # Create geometry objects
        sections = []
        for section in cue_design.sections.all():
            start = Point3D(
                section.start_position_in, section.outer_diameter_start_mm / 2
            )
            end = Point3D(section.end_position_in, section.outer_diameter_end_mm / 2)
            sections.append(CueSectionGeometry(section.section_type, start, end))

        geometry = CueDesignGeometry(sections)

        # Generate profile points
        profile_points = []
        for i in range(int(geometry.total_length * 10) + 1):  # 0.1 inch resolution
            x = i / 10
            try:
                radius = geometry.radius_at_position(x)
                profile_points.append(
                    {"x": x, "radius": radius, "diameter": radius * 2}
                )
            except ValueError:
                continue

        return Response(
            {
                "profile_points": profile_points,
                "total_length": geometry.total_length,
                "sections": [
                    {
                        "type": section.section_type,
                        "start_x": section.start.x,
                        "end_x": section.end.x,
                        "start_radius": section.start_radius,
                        "end_radius": section.end_radius,
                        "taper_angle": section.taper_angle_degrees,
                    }
                    for section in geometry.sections
                ],
            }
        )


class CueSectionViewSet(viewsets.ModelViewSet):
    """API endpoint for cue sections"""

    queryset = CueSection.objects.all()
    serializer_class = CueSectionSerializer
