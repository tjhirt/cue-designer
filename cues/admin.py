from django.contrib import admin
from .models import CueDesign, CueSection


@admin.register(CueDesign)
class CueDesignAdmin(admin.ModelAdmin):
    list_display = [
        "cue_id",
        "design_style",
        "overall_length_in",
        "created_at",
        "updated_at",
    ]
    search_fields = ["cue_id", "design_style"]
    list_filter = ["design_style", "symmetry_type", "era_influence", "complexity_level"]
    readonly_fields = ["created_at", "updated_at"]


@admin.register(CueSection)
class CueSectionAdmin(admin.ModelAdmin):
    list_display = [
        "section_id",
        "cue_design",
        "section_type",
        "start_position_in",
        "end_position_in",
    ]
    list_filter = ["section_type"]
    search_fields = ["section_id"]
