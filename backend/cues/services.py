from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from cues.models import CueDesign
from cues.geometry.core import Point3D, CueSectionGeometry, CueDesignGeometry
from cues.rendering.svg_generator import SVGGenerator


@api_view(["GET"])
def cue_svg_profile(request, cue_id):
    """Generate SVG profile view for a cue design"""
    try:
        cue_design = CueDesign.objects.get(cue_id=cue_id)
    except CueDesign.DoesNotExist:
        return Response({"error": "Cue design not found"}, status=404)

    # Create geometry objects
    sections = []
    for section in cue_design.sections.all():
        start = Point3D(section.start_position_in, section.outer_diameter_start_mm / 2)
        end = Point3D(section.end_position_in, section.outer_diameter_end_mm / 2)
        sections.append(CueSectionGeometry(section.section_type, start, end))

    geometry = CueDesignGeometry(sections)

    # Generate SVG
    svg_generator = SVGGenerator(geometry)
    svg_content = svg_generator.generate_profile_view()

    return HttpResponse(svg_content, content_type="image/svg+xml")
