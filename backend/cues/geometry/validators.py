from django.core.exceptions import ValidationError
from typing import List, Dict, Any
from .core import CueSectionGeometry, CueDesignGeometry


class CueGeometryValidator:
    """Validate cue geometry constraints"""

    @staticmethod
    def validate_section(section_data: Dict[str, Any]) -> List[str]:
        """Validate individual cue section"""
        issues = []

        # Check basic dimensions
        start_pos = section_data.get("start_position_in", 0)
        end_pos = section_data.get("end_position_in", 0)
        start_diameter = section_data.get("outer_diameter_start_mm", 0)
        end_diameter = section_data.get("outer_diameter_end_mm", 0)

        if start_pos >= end_pos:
            issues.append("Start position must be less than end position")

        if start_pos < 0:
            issues.append("Start position cannot be negative")

        if start_diameter <= 0 or end_diameter <= 0:
            issues.append("Outer diameters must be positive")

        if start_diameter > 50 or end_diameter > 50:
            issues.append("Outer diameters cannot exceed 50mm")

        # Check taper rate
        length = end_pos - start_pos
        if length > 0:
            taper_rate = (end_diameter - start_diameter) / length
            if abs(taper_rate) > 2.0:  # More than 2mm per inch taper
                issues.append(
                    f"Taper rate too steep: {taper_rate:.2f}mm/in (max 2mm/in)"
                )

        return issues

    @staticmethod
    def validate_sections_continuity(sections_data: List[Dict[str, Any]]) -> List[str]:
        """Validate continuity between sections"""
        if len(sections_data) < 2:
            return []

        issues = []
        # Sort by start position
        sorted_sections = sorted(sections_data, key=lambda s: s["start_position_in"])

        for i in range(len(sorted_sections) - 1):
            current = sorted_sections[i]
            next_section = sorted_sections[i + 1]

            # Check for gaps
            gap = next_section["start_position_in"] - current["end_position_in"]
            if gap > 0.01:  # More than 0.01 inch gap
                issues.append(
                    f'Gap of {gap:.2f}" between {current.get("section_type", "section")} and {next_section.get("section_type", "section")}'
                )

            # Check for overlaps
            if gap < 0:
                issues.append(
                    f"Overlap between {current.get('section_type', 'section')} and {next_section.get('section_type', 'section')}"
                )

            # Check for diameter jumps
            diameter_diff = abs(
                current["outer_diameter_end_mm"]
                - next_section["outer_diameter_start_mm"]
            )
            if diameter_diff > 1.0:  # More than 1mm jump
                issues.append(
                    f"Large diameter jump of {diameter_diff:.2f}mm between sections"
                )

        return issues

    @staticmethod
    def validate_manufacturing_constraints(geometry: CueDesignGeometry) -> List[str]:
        """Validate manufacturing constraints on complete geometry"""
        issues = []

        for section in geometry.sections:
            # Check taper angle
            if abs(section.taper_angle_degrees) > 5.0:  # Max 5 degrees
                issues.append(
                    f"{section.section_type} taper angle too steep: {section.taper_angle_degrees:.2f}° (max 5°)"
                )

            # Check minimum radius
            min_radius = min(section.start_radius, section.end_radius)
            if min_radius < 5.0:  # Minimum 5mm radius
                issues.append(
                    f"{section.section_type} radius too small: {min_radius:.2f}mm (min 5mm)"
                )

            # Check maximum radius
            max_radius = max(section.start_radius, section.end_radius)
            if max_radius > 25.0:  # Maximum 25mm radius
                issues.append(
                    f"{section.section_type} radius too large: {max_radius:.2f}mm (max 25mm)"
                )

            # Check section length
            if section.length < 2.0:  # Minimum 2 inch section
                issues.append(
                    f'{section.section_type} too short: {section.length:.2f}" (min 2")'
                )
            if section.length > 20.0:  # Maximum 20 inch section
                issues.append(
                    f'{section.section_type} too long: {section.length:.2f}" (max 20")'
                )

        # Check total length
        if geometry.total_length > 40.0:  # Max 40 inch butt section
            issues.append(
                f'Total length too long: {geometry.total_length:.2f}" (max 40")'
            )

        # Check for duplicate section types
        section_types = [s.section_type for s in geometry.sections]
        if len(section_types) != len(set(section_types)):
            duplicates = [t for t in section_types if section_types.count(t) > 1]
            issues.append(f"Duplicate section types: {', '.join(set(duplicates))}")

        return issues

    SECTION_CONSTRAINTS = {
        "joint": {
            "min_length_in": 0.5,
            "max_length_in": 2.0,
            "min_diameter_mm": 18.0,
            "max_diameter_mm": 25.0,
        },
        "forearm": {
            "min_length_in": 8.0,
            "max_length_in": 14.0,
            "min_diameter_mm": 19.0,
            "max_diameter_mm": 24.0,
        },
        "handle": {
            "min_length_in": 8.0,
            "max_length_in": 12.0,
            "min_diameter_mm": 20.0,
            "max_diameter_mm": 26.0,
        },
        "sleeve": {
            "min_length_in": 4.0,
            "max_length_in": 8.0,
            "min_diameter_mm": 24.0,
            "max_diameter_mm": 32.0,
        },
        "butt": {
            "min_length_in": 2.0,
            "max_length_in": 6.0,
            "min_diameter_mm": 26.0,
            "max_diameter_mm": 32.0,
        },
    }

    @staticmethod
    def validate_section_sequence(sections_data: List[Dict[str, Any]]) -> List[str]:
        """Validate proper section ordering: joint → forearm → handle → sleeve → butt"""
        VALID_SEQUENCE = ["joint", "forearm", "handle", "sleeve", "butt"]
        issues = []

        if not sections_data:
            return issues

        sorted_sections = sorted(sections_data, key=lambda s: s["start_position_in"])
        section_types = [s["section_type"] for s in sorted_sections]

        for i, expected_type in enumerate(VALID_SEQUENCE):
            if i >= len(section_types):
                break
            actual_type = section_types[i]
            if actual_type != expected_type:
                issues.append(
                    f"Section {i + 1} should be '{expected_type}' but found '{actual_type}'"
                )

        return issues

    @staticmethod
    def validate_section_constraints(section_data: Dict[str, Any]) -> List[str]:
        """Validate section-specific length and diameter constraints"""
        issues = []
        section_type = section_data.get("section_type")

        if section_type not in SECTION_CONSTRAINTS:
            return issues

        constraints = SECTION_CONSTRAINTS[section_type]

        length = section_data.get("end_position_in", 0) - section_data.get(
            "start_position_in", 0
        )
        if length < constraints["min_length_in"]:
            issues.append(
                f'{section_type} too short: {length:.2f}" (min {constraints["min_length_in"]}")'
            )
        if length > constraints["max_length_in"]:
            issues.append(
                f'{section_type} too long: {length:.2f}" (max {constraints["max_length_in"]}")'
            )

        start_diameter = section_data.get("outer_diameter_start_mm", 0)
        end_diameter = section_data.get("outer_diameter_end_mm", 0)

        for diameter, label in [(start_diameter, "Start"), (end_diameter, "End")]:
            if diameter < constraints["min_diameter_mm"]:
                issues.append(
                    f"{section_type} {label} diameter too small: {diameter:.2f}mm (min {constraints['min_diameter_mm']}mm)"
                )
            if diameter > constraints["max_diameter_mm"]:
                issues.append(
                    f"{section_type} {label} diameter too large: {diameter:.2f}mm (max {constraints['max_diameter_mm']}mm)"
                )

        return issues


class InlayPatternValidator:
    """Validate inlay pattern structures"""

    VALID_CATEGORIES = ["boxed", "slash", "dot", "wrap", "inlay"]
    VALID_STYLES = [
        "window_box",
        "raised_box",
        "recessed_box",
        "single_slash",
        "double_slash",
        "cross_slash",
        "single_dot",
        "double_dot",
        "cluster_dot",
        "full_wrap",
        "partial_wrap",
        "spiral_wrap",
        "surface_inlay",
        "pocket_inlay",
        "inlay_ring",
    ]
    VALID_MATERIALS = [
        "ebony",
        "maple",
        "rosewood",
        "cocobolo",
        "ivory",
        "abalone",
        "mother_of_pearl",
        "turquoise",
        "silver",
        "gold",
        "brass",
    ]

    @classmethod
    def validate_pattern(cls, pattern_data: Dict[str, Any]) -> List[str]:
        """Validate individual inlay pattern"""
        issues = []

        # Required fields
        required_fields = ["pattern_id", "pattern_category", "pattern_style"]
        for field in required_fields:
            if field not in pattern_data:
                issues.append(f"Missing required field: {field}")

        # Validate category
        category = pattern_data.get("pattern_category")
        if category and category not in cls.VALID_CATEGORIES:
            issues.append(f"Invalid pattern category: {category}")

        # Validate style
        style = pattern_data.get("pattern_style")
        if style and style not in cls.VALID_STYLES:
            issues.append(f"Invalid pattern style: {style}")

        # Validate repeat count
        repeat_count = pattern_data.get("repeat_count", 1)
        if not isinstance(repeat_count, int) or repeat_count < 1 or repeat_count > 24:
            issues.append(f"Invalid repeat count: {repeat_count} (must be 1-24)")

        # Validate geometric definition
        geom_def = pattern_data.get("geometric_definition")
        if geom_def:
            issues.extend(cls._validate_geometric_definition(geom_def))

        # Validate material assignment
        material_assign = pattern_data.get("material_assignment")
        if material_assign:
            issues.extend(cls._validate_material_assignment(material_assign))

        return issues

    @classmethod
    def _validate_geometric_definition(cls, geom_def: Dict[str, Any]) -> List[str]:
        """Validate geometric definition"""
        issues = []

        geometry_type = geom_def.get("geometry_type")
        valid_types = ["rectangular_prism", "cylinder", "sphere", "custom"]
        if geometry_type not in valid_types:
            issues.append(f"Invalid geometry type: {geometry_type}")

        dimensions = geom_def.get("dimensions_mm")
        if dimensions and not isinstance(dimensions, dict):
            issues.append("Dimensions must be an object")

        orientation = geom_def.get("orientation")
        if orientation and not isinstance(orientation, dict):
            issues.append("Orientation must be an object")

        positioning = geom_def.get("positioning")
        if positioning and not isinstance(positioning, dict):
            issues.append("Positioning must be an object")

        return issues

    @classmethod
    def _validate_material_assignment(
        cls, material_assign: Dict[str, Any]
    ) -> List[str]:
        """Validate material assignment"""
        issues = []

        required_material_fields = ["base_material", "inlay_material"]
        for field in required_material_fields:
            if field not in material_assign:
                issues.append(f"Missing required material field: {field}")

        base_material = material_assign.get("base_material")
        if base_material and base_material not in cls.VALID_MATERIALS:
            issues.append(f"Invalid base material: {base_material}")

        inlay_material = material_assign.get("inlay_material")
        if inlay_material and inlay_material not in cls.VALID_MATERIALS:
            issues.append(f"Invalid inlay material: {inlay_material}")

        contrast_level = material_assign.get("contrast_level")
        valid_contrast = ["low", "medium", "high"]
        if contrast_level and contrast_level not in valid_contrast:
            issues.append(f"Invalid contrast level: {contrast_level}")

        finish_type = material_assign.get("finish_type")
        valid_finishes = ["matte", "satin", "high_gloss"]
        if finish_type and finish_type not in valid_finishes:
            issues.append(f"Invalid finish type: {finish_type}")

        return issues
