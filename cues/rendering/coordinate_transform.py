from typing import Tuple


class CoordinateTransform:
    """Handle coordinate transformation from geometry to SVG coordinates"""

    def __init__(self, width: int = 1200, height: int = 400, padding: int = 50):
        self.width = width
        self.height = height
        self.padding = padding
        self.available_width = width - 2 * padding
        self.available_height = height - 2 * padding

    def geometry_to_svg(
        self, x_in: float, radius_mm: float, cue_length: float, max_radius: float
    ) -> Tuple[float, float]:
        """
        Convert geometry coordinates to SVG coordinates

        Args:
            x_in: Position along cue in inches
            radius_mm: Radius in mm
            cue_length: Total cue length in inches
            max_radius: Maximum radius in mm for scaling

        Returns:
            Tuple of (svg_x, svg_y) coordinates
        """
        # Scale x position to fit width
        svg_x = self.padding + (x_in / cue_length) * self.available_width

        # Scale radius to fit height (convert to diameter, then scale)
        svg_y = self.height // 2 - (radius_mm / max_radius) * (
            self.available_height / 2
        )

        return svg_x, svg_y

    def geometry_to_svg_diameter(
        self, x_in: float, diameter_mm: float, cue_length: float, max_diameter: float
    ) -> Tuple[float, float, float, float]:
        """
        Convert geometry coordinates to SVG diameter endpoints

        Returns:
            Tuple of (x, y_top, x, y_bottom) for vertical line
        """
        svg_x = self.padding + (x_in / cue_length) * self.available_width
        half_height_svg = (diameter_mm / max_diameter) * (self.available_height / 2)

        y_top = self.height // 2 - half_height_svg
        y_bottom = self.height // 2 + half_height_svg

        return svg_x, y_top, svg_x, y_bottom

    def get_scale_factors(
        self, cue_length: float, max_radius: float
    ) -> Tuple[float, float]:
        """Get scaling factors for display"""
        x_scale = self.available_width / cue_length  # pixels per inch
        y_scale = (self.available_height / 2) / max_radius  # pixels per mm
        return x_scale, y_scale
