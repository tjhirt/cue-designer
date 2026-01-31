from django.db import models
from django.core.exceptions import ValidationError
import json


class CueDesign(models.Model):
    DESIGN_STYLE_CHOICES = [
        ("traditional_classic", "Traditional Classic"),
        ("modern_minimal", "Modern Minimal"),
        ("ornate", "Ornate"),
        ("art_deco", "Art Deco"),
        ("contemporary", "Contemporary"),
    ]

    SYMMETRY_CHOICES = [
        ("radial", "Radial"),
        ("bilateral", "Bilateral"),
        ("asymmetric", "Asymmetric"),
    ]

    ERA_CHOICES = [
        ("vintage", "Vintage"),
        ("traditional", "Traditional"),
        ("modern", "Modern"),
        ("contemporary", "Contemporary"),
    ]

    COMPLEXITY_CHOICES = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
    ]

    cue_id = models.CharField(max_length=20, unique=True)
    design_style = models.CharField(max_length=30, choices=DESIGN_STYLE_CHOICES)
    overall_length_in = models.FloatField()
    symmetry_type = models.CharField(max_length=15, choices=SYMMETRY_CHOICES)
    era_influence = models.CharField(max_length=20, choices=ERA_CHOICES)
    complexity_level = models.CharField(max_length=10, choices=COMPLEXITY_CHOICES)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["cue_id"]

    def __str__(self):
        return f"{self.cue_id} - {self.design_style}"

    def clean(self):
        if self.overall_length_in <= 0:
            raise ValidationError("Overall length must be positive")
        if self.overall_length_in > 40:  # Max reasonable cue butt length
            raise ValidationError("Overall length cannot exceed 40 inches")


class CueSection(models.Model):
    SECTION_TYPES = [
        ("forearm", "Forearm"),
        ("handle", "Handle"),
        ("butt_sleeve", "Butt Sleeve"),
    ]

    PATTERN_CATEGORIES = [
        ("boxed", "Boxed"),
        ("slash", "Slash"),
        ("dot", "Dot"),
        ("wrap", "Wrap"),
        ("inlay", "Inlay"),
    ]

    cue_design = models.ForeignKey(
        CueDesign, on_delete=models.CASCADE, related_name="sections"
    )
    section_id = models.CharField(max_length=50)
    section_type = models.CharField(max_length=15, choices=SECTION_TYPES)
    start_position_in = models.FloatField()
    end_position_in = models.FloatField()
    outer_diameter_start_mm = models.FloatField()
    outer_diameter_end_mm = models.FloatField()
    inlay_patterns = models.JSONField(default=list, blank=True)

    class Meta:
        ordering = ["start_position_in"]
        unique_together = ["cue_design", "section_id"]

    def __str__(self):
        return f"{self.cue_design.cue_id} - {self.section_type}"

    def clean(self):
        if self.start_position_in >= self.end_position_in:
            raise ValidationError("Start position must be less than end position")
        if self.start_position_in < 0:
            raise ValidationError("Start position cannot be negative")
        if self.outer_diameter_start_mm <= 0 or self.outer_diameter_end_mm <= 0:
            raise ValidationError("Outer diameters must be positive")
        if self.outer_diameter_start_mm > 50 or self.outer_diameter_end_mm > 50:
            raise ValidationError("Outer diameters cannot exceed 50mm")

        # Validate section is within cue design length
        if self.end_position_in > self.cue_design.overall_length_in:
            raise ValidationError(
                "Section end position cannot exceed overall cue length"
            )

        # Validate inlay patterns structure
        if self.inlay_patterns:
            try:
                for pattern in self.inlay_patterns:
                    self._validate_inlay_pattern(pattern)
            except (TypeError, ValueError) as e:
                raise ValidationError(f"Invalid inlay pattern structure: {e}")

    def _validate_inlay_pattern(self, pattern):
        """Validate individual inlay pattern structure"""
        required_fields = ["pattern_id", "pattern_category", "pattern_style"]
        for field in required_fields:
            if field not in pattern:
                raise ValidationError(f"Inlay pattern missing required field: {field}")

        if pattern["pattern_category"] not in [
            choice[0] for choice in self.PATTERN_CATEGORIES
        ]:
            raise ValidationError(
                f"Invalid pattern category: {pattern['pattern_category']}"
            )

    @property
    def length_in(self):
        return self.end_position_in - self.start_position_in

    @property
    def taper_rate_mm_per_in(self):
        """Calculate taper rate in mm per inch"""
        length = self.length_in
        if length == 0:
            return 0
        return (self.outer_diameter_end_mm - self.outer_diameter_start_mm) / length
