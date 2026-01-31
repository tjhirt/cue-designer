from rest_framework import serializers
from django.core.exceptions import ValidationError
from ..models import CueDesign, CueSection
from cues.geometry.core import CueSectionGeometry, CueDesignGeometry


class CueSectionSerializer(serializers.ModelSerializer):
    length_in = serializers.ReadOnlyField()
    taper_rate_mm_per_in = serializers.ReadOnlyField()

    class Meta:
        model = CueSection
        fields = "__all__"

    def validate(self, attrs):
        # Custom validation for section continuity
        instance = CueSection(**attrs)
        try:
            instance.clean()
        except ValidationError as e:
            raise serializers.ValidationError(e.messages)
        return attrs


class CueDesignSerializer(serializers.ModelSerializer):
    sections = CueSectionSerializer(many=True, read_only=True)

    class Meta:
        model = CueDesign
        fields = "__all__"

    def validate(self, attrs):
        # Custom validation for manufacturing constraints
        instance = CueDesign(**attrs)
        try:
            instance.clean()
        except ValidationError as e:
            raise serializers.ValidationError(e.messages)
        return attrs


class CueDesignCreateSerializer(CueDesignSerializer):
    """Serializer for creating cue designs with sections in one request"""

    sections = CueSectionSerializer(many=True)

    def create(self, validated_data):
        sections_data = validated_data.pop("sections")
        cue_design = CueDesign.objects.create(**validated_data)

        for section_data in sections_data:
            CueSection.objects.create(cue_design=cue_design, **section_data)

        # Validate geometry
        geometry = self._create_geometry_from_db(cue_design)
        self._validate_geometry(geometry)

        return cue_design

    def _create_geometry_from_db(self, cue_design):
        """Create geometry objects from database models"""
        sections = []
        for section in cue_design.sections.all():
            from .geometry.core import Point3D, CueSectionGeometry

            start = Point3D(
                section.start_position_in, section.outer_diameter_start_mm / 2
            )
            end = Point3D(section.end_position_in, section.outer_diameter_end_mm / 2)
            sections.append(CueSectionGeometry(section.section_type, start, end))

        return CueDesignGeometry(sections)

    def _validate_geometry(self, geometry):
        """Validate complete geometry"""
        continuity_issues = geometry.validate_continuity()
        manufacturing_issues = geometry.validate_manufacturing_constraints()

        all_issues = continuity_issues + manufacturing_issues
        if all_issues:
            raise serializers.ValidationError({"geometry_validation": all_issues})


class CueGeometrySerializer(serializers.Serializer):
    """Serializer for geometry-only operations"""

    cue_design_id = serializers.IntegerField()

    def validate_cue_design_id(self, value):
        if not CueDesign.objects.filter(id=value).exists():
            raise serializers.ValidationError("Cue design not found")
        return value
