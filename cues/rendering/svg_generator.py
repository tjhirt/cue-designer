from xml.etree.ElementTree import Element, SubElement, tostring
from typing import List, Tuple
from cues.geometry.core import CueDesignGeometry
from .coordinate_transform import CoordinateTransform


class SVGGenerator:
    """Generate SVG representations of cue designs"""

    def __init__(
        self, geometry: CueDesignGeometry, width: int = 1200, height: int = 400
    ):
        self.geometry = geometry
        self.width = width
        self.height = height
        self.transform = CoordinateTransform(width, height)
        self.max_radius = self._get_max_radius()

    def _get_max_radius(self) -> float:
        """Get maximum radius for scaling"""
        if not self.geometry.sections:
            return 10.0

        max_radius = 0.0
        for section in self.geometry.sections:
            max_radius = max(max_radius, section.start_radius, section.end_radius)

        return max_radius * 1.1  # Add 10% padding

    def generate_profile_view(self) -> str:
        """Generate SVG profile view (2D side view)"""
        # Create root SVG element
        svg = Element(
            "svg",
            {
                "width": str(self.width),
                "height": str(self.height),
                "viewBox": f"0 0 {self.width} {self.height}",
                "xmlns": "http://www.w3.org/2000/svg",
                "style": "font-family: Arial, sans-serif;",
            },
        )

        # Add background
        SubElement(
            svg,
            "rect",
            {"width": str(self.width), "height": str(self.height), "fill": "#f8f9fa"},
        )

        # Add grid lines
        self._add_grid_lines(svg)

        # Add centerline
        self._add_centerline(svg)

        # Add cue profile
        self._add_cue_profile(svg)

        # Add section dividers
        self._add_section_dividers(svg)

        # Add dimensions
        self._add_dimensions(svg)

        # Add legend
        self._add_legend(svg)

        return tostring(svg, encoding="unicode")

    def _add_grid_lines(self, svg):
        """Add background grid for reference"""
        grid_group = SubElement(svg, "g", {"class": "grid", "opacity": "0.3"})

        # Vertical lines (every inch)
        for i in range(int(self.geometry.total_length) + 1):
            x = (
                self.transform.padding
                + (i / self.geometry.total_length) * self.transform.available_width
            )
            SubElement(
                grid_group,
                "line",
                {
                    "x1": str(x),
                    "y1": str(self.transform.padding),
                    "x2": str(x),
                    "y2": str(self.height - self.transform.padding),
                    "stroke": "#cccccc",
                    "stroke-width": "1",
                },
            )

        # Horizontal lines (every 5mm)
        for mm in range(0, int(self.max_radius * 2), 5):
            y_top = (
                self.height // 2
                - (mm / (self.max_radius * 2)) * self.transform.available_height
            )
            y_bottom = (
                self.height // 2
                + (mm / (self.max_radius * 2)) * self.transform.available_height
            )

            SubElement(
                grid_group,
                "line",
                {
                    "x1": str(self.transform.padding),
                    "y1": str(y_top),
                    "x2": str(self.width - self.transform.padding),
                    "y2": str(y_top),
                    "stroke": "#cccccc",
                    "stroke-width": "1",
                },
            )

            SubElement(
                grid_group,
                "line",
                {
                    "x1": str(self.transform.padding),
                    "y1": str(y_bottom),
                    "x2": str(self.width - self.transform.padding),
                    "y2": str(y_bottom),
                    "stroke": "#cccccc",
                    "stroke-width": "1",
                },
            )

    def _add_centerline(self, svg):
        """Add centerline reference"""
        centerline_group = SubElement(svg, "g", {"class": "centerline"})
        SubElement(
            centerline_group,
            "line",
            {
                "x1": str(self.transform.padding),
                "y1": str(self.height // 2),
                "x2": str(self.width - self.transform.padding),
                "y2": str(self.height // 2),
                "stroke": "#666666",
                "stroke-width": "2",
                "stroke-dasharray": "10,5",
            },
        )

    def _add_cue_profile(self, svg):
        """Add the actual cue profile geometry"""
        if not self.geometry.sections:
            return

        profile_group = SubElement(svg, "g", {"class": "cue-profile"})

        # Generate profile path
        path_data = self._generate_profile_path()

        SubElement(
            profile_group,
            "path",
            {
                "d": path_data,
                "fill": "#8B4513",  # Wood color
                "stroke": "#654321",
                "stroke-width": "2",
            },
        )

        # Add wood grain effect
        self._add_wood_grain(profile_group)

    def _generate_profile_path(self) -> str:
        """Generate SVG path data for cue profile"""
        if not self.geometry.sections:
            return ""

        path_points = []

        # Top profile (left to right)
        for section in self.geometry.sections:
            steps = 20  # Points per section for smooth curves
            for i in range(steps + 1):
                t = i / steps
                x = section.start.x + t * (section.end.x - section.start.x)
                radius = section.start_radius + t * (
                    section.end_radius - section.start_radius
                )

                svg_x, svg_y = self.transform.geometry_to_svg(
                    x, radius, self.geometry.total_length, self.max_radius
                )
                path_points.append(f"{svg_x:.1f},{svg_y:.1f}")

        # Bottom profile (right to left)
        for section in reversed(self.geometry.sections):
            steps = 20
            for i in range(steps + 1):
                t = i / steps
                x = section.end.x - t * (section.end.x - section.start.x)
                radius = section.end_radius - t * (
                    section.end_radius - section.start_radius
                )

                svg_x, svg_y = self.transform.geometry_to_svg(
                    x, -radius, self.geometry.total_length, self.max_radius
                )
                path_points.append(f"{svg_x:.1f},{svg_y:.1f}")

        # Close path
        path_points.append(path_points[0])

        return f"M {' L '.join(path_points)} Z"

    def _add_wood_grain(self, parent_group):
        """Add subtle wood grain effect"""
        grain_group = SubElement(
            parent_group, "g", {"class": "wood-grain", "opacity": "0.1"}
        )

        # Add diagonal lines for wood grain effect
        for i in range(5):
            offset = i * 100
            SubElement(
                grain_group,
                "line",
                {
                    "x1": str(offset),
                    "y1": "0",
                    "x2": str(offset + 200),
                    "y2": str(self.height),
                    "stroke": "#333333",
                    "stroke-width": "1",
                },
            )

    def _add_section_dividers(self, svg):
        """Add visual dividers between sections"""
        if len(self.geometry.sections) <= 1:
            return

        divider_group = SubElement(svg, "g", {"class": "section-dividers"})

        for i in range(len(self.geometry.sections) - 1):
            current = self.geometry.sections[i]
            next_section = self.geometry.sections[i + 1]

            x = (
                self.transform.padding
                + (current.end.x / self.geometry.total_length)
                * self.transform.available_width
            )

            SubElement(
                divider_group,
                "line",
                {
                    "x1": str(x),
                    "y1": str(self.transform.padding),
                    "x2": str(x),
                    "y2": str(self.height - self.transform.padding),
                    "stroke": "#ff6600",
                    "stroke-width": "2",
                    "stroke-dasharray": "5,5",
                },
            )

            # Add section label
            label_y = self.transform.padding - 10
            SubElement(
                divider_group,
                "text",
                {
                    "x": str(x),
                    "y": str(label_y),
                    "text-anchor": "middle",
                    "font-size": "10",
                    "fill": "#666666",
                },
            ).text = current.section_type.replace("_", " ").title()

    def _add_dimensions(self, svg):
        """Add dimension annotations"""
        dim_group = SubElement(svg, "g", {"class": "dimensions", "font-size": "12"})

        # Total length dimension
        length_text = f'{self.geometry.total_length:.1f}"'
        SubElement(
            dim_group,
            "text",
            {
                "x": str(self.width // 2),
                "y": str(self.height - 10),
                "text-anchor": "middle",
                "fill": "#333333",
                "font-weight": "bold",
            },
        ).text = length_text

        # Diameter dimensions
        for section in self.geometry.sections:
            # Start diameter
            if section.start.x == self.geometry.sections[0].start.x:
                diameter_text = f"Ø{section.start_radius * 2:.1f}mm"
                svg_x, _ = self.transform.geometry_to_svg(
                    section.start.x,
                    section.start_radius,
                    self.geometry.total_length,
                    self.max_radius,
                )
                SubElement(
                    dim_group,
                    "text",
                    {
                        "x": str(svg_x),
                        "y": str(self.transform.padding - 20),
                        "text-anchor": "middle",
                        "fill": "#333333",
                        "font-size": "10",
                    },
                ).text = diameter_text

    def _add_legend(self, svg):
        """Add legend and scale information"""
        legend_group = SubElement(svg, "g", {"class": "legend", "font-size": "10"})

        # Scale information
        x_scale, y_scale = self.transform.get_scale_factors(
            self.geometry.total_length, self.max_radius
        )
        scale_text = f"Scale: {x_scale:.1f} px/in, {y_scale:.1f} px/mm"
        SubElement(
            legend_group,
            "text",
            {
                "x": str(self.width - self.transform.padding),
                "y": str(self.height - 20),
                "text-anchor": "end",
                "fill": "#666666",
            },
        ).text = scale_text

        # Section count
        section_text = f"Sections: {len(self.geometry.sections)}"
        SubElement(
            legend_group,
            "text",
            {
                "x": str(self.width - self.transform.padding),
                "y": str(self.height - 10),
                "text-anchor": "end",
                "fill": "#666666",
            },
        ).text = section_text
