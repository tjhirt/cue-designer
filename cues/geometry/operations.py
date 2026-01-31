import math
from typing import List, Dict, Any, Optional
from .core import CueSectionGeometry, CueDesignGeometry, Point3D, Vector3D
from shapely.geometry import LineString, Polygon, Point as ShapelyPoint
from shapely.ops import unary_union


class GeometryOperations:
    """Advanced geometry operations for cue design"""

    @staticmethod
    def calculate_centerline(geometry: CueDesignGeometry) -> LineString:
        """Calculate the centerline of the cue design"""
        points = []
        for section in geometry.sections:
            points.extend(
                [
                    (section.start.x, 0),  # Y is always 0 for centerline
                    (section.end.x, 0),
                ]
            )

        # Remove duplicates and ensure ordered
        unique_points = []
        for i, point in enumerate(points):
            if i == 0 or point != points[i - 1]:
                unique_points.append(point)

        return LineString(unique_points)

    @staticmethod
    def calculate_outer_profile(geometry: CueDesignGeometry) -> LineString:
        """Calculate the outer profile of the cue design"""
        points = []

        # Top profile (left to right)
        for section in geometry.sections:
            steps = 50  # High resolution for smooth curves
            for i in range(steps + 1):
                t = i / steps
                x = section.start.x + t * (section.end.x - section.start.x)
                radius = section.start_radius + t * (
                    section.end_radius - section.start_radius
                )
                points.append((x, radius))

        # Bottom profile (right to left)
        for section in reversed(geometry.sections):
            steps = 50
            for i in range(steps + 1):
                t = i / steps
                x = section.end.x - t * (section.end.x - section.start.x)
                radius = section.end_radius - t * (
                    section.end_radius - section.start_radius
                )
                points.append((x, radius))

        return LineString(points)

    @staticmethod
    def calculate_cross_section(
        geometry: CueDesignGeometry, x_position: float
    ) -> Optional[Polygon]:
        """Calculate cross-section at a given position"""
        section = geometry.get_section_at_position(x_position)
        if not section:
            return None

        radius = section.radius_at_position(x_position)

        # Create circle as polygon with many points
        points = []
        num_points = 64
        for i in range(num_points):
            angle = 2 * math.pi * i / num_points
            y = radius * math.cos(angle)
            z = radius * math.sin(angle)
            points.append((y, z))  # Use Y, Z for cross-section plane

        return Polygon(points)

    @staticmethod
    def calculate_surface_area(geometry: CueDesignGeometry) -> float:
        """Calculate total surface area in square inches"""
        total_area = 0.0
        for section in geometry.sections:
            total_area += section.surface_area()
        return total_area

    @staticmethod
    def calculate_volume(geometry: CueDesignGeometry) -> float:
        """Calculate total volume in cubic inches"""
        total_volume = 0.0
        for section in geometry.sections:
            total_volume += section.volume()
        return total_volume

    @staticmethod
    def calculate_weight(
        geometry: CueDesignGeometry, density_map: Dict[str, float]
    ) -> float:
        """Calculate estimated weight based on material densities"""
        # This is a simplified calculation - real implementation would need material assignments
        total_volume = GeometryOperations.calculate_volume(geometry)
        # Default to ebony density (approx 1.2 g/cm³)
        default_density = density_map.get("default", 1.2)

        # Convert cubic inches to cubic cm, then calculate weight
        volume_cm3 = total_volume * 16.387  # 1 cubic inch = 16.387 cubic cm
        weight_grams = volume_cm3 * default_density
        weight_ounces = weight_grams / 28.3495  # Convert to ounces

        return weight_ounces

    @staticmethod
    def find_intersection_points(
        geometry1: CueDesignGeometry, geometry2: CueDesignGeometry
    ) -> List[ShapelyPoint]:
        """Find intersection points between two cue geometries"""
        profile1 = GeometryOperations.calculate_outer_profile(geometry1)
        profile2 = GeometryOperations.calculate_outer_profile(geometry2)

        intersection = profile1.intersection(profile2)

        points = []
        if intersection.geom_type == "Point":
            points.append(intersection)
        elif intersection.geom_type == "MultiPoint":
            points.extend(list(intersection.geoms))
        elif intersection.geom_type == "GeometryCollection":
            for geom in intersection.geoms:
                if geom.geom_type == "Point":
                    points.append(geom)

        return points

    @staticmethod
    def calculate_geometric_properties(geometry: CueDesignGeometry) -> Dict[str, Any]:
        """Calculate comprehensive geometric properties"""
        return {
            "total_length": geometry.total_length,
            "total_surface_area": GeometryOperations.calculate_surface_area(geometry),
            "total_volume": GeometryOperations.calculate_volume(geometry),
            "center_of_mass": GeometryOperations._calculate_center_of_mass(geometry),
            "moment_of_inertia": GeometryOperations._calculate_moment_of_inertia(
                geometry
            ),
            "sections_count": len(geometry.sections),
            "max_radius": max(
                max(s.start_radius, s.end_radius) for s in geometry.sections
            ),
            "min_radius": min(
                min(s.start_radius, s.end_radius) for s in geometry.sections
            ),
            "average_radius": sum(
                (s.start_radius + s.end_radius) / 2 for s in geometry.sections
            )
            / len(geometry.sections),
        }

    @staticmethod
    def _calculate_center_of_mass(geometry: CueDesignGeometry) -> Dict[str, float]:
        """Calculate center of mass (simplified for uniform density)"""
        # This is a simplified calculation
        total_volume = 0.0
        weighted_x = 0.0

        for section in geometry.sections:
            volume = section.volume()
            total_volume += volume

            # Approximate center of section
            section_center_x = (section.start.x + section.end.x) / 2
            weighted_x += volume * section_center_x

        if total_volume > 0:
            center_x = weighted_x / total_volume
            return {"x": center_x, "y": 0.0, "z": 0.0}

        return {"x": 0.0, "y": 0.0, "z": 0.0}

    @staticmethod
    def _calculate_moment_of_inertia(geometry: CueDesignGeometry) -> Dict[str, float]:
        """Calculate moment of inertia (simplified)"""
        # Very simplified calculation - real implementation would be much more complex
        total_volume = GeometryOperations.calculate_volume(geometry)
        max_radius = max(max(s.start_radius, s.end_radius) for s in geometry.sections)

        # Approximate moment of inertia for uniform cylinder
        mass = total_volume * 1.2  # Assuming density of 1.2 g/cm³

        # I = (1/2) * m * r² for cylinder about central axis
        I_axial = 0.5 * mass * (max_radius / 25.4) ** 2  # Convert mm to inches

        # I = (1/12) * m * (3r² + L²) for cylinder about perpendicular axis
        I_perpendicular = (
            (1 / 12) * mass * (3 * (max_radius / 25.4) ** 2 + geometry.total_length**2)
        )

        return {"axial": I_axial, "perpendicular": I_perpendicular}


class ManufacturingTolerances:
    """Manufacturing tolerance calculations"""

    # Standard tolerances (in mm)
    DIAMETER_TOLERANCE = 0.05  # ±0.05mm
    LENGTH_TOLERANCE = 0.1  # ±0.1mm
    TAPER_TOLERANCE = 0.5  # ±0.5°
    CONCENTRICITY_TOLERANCE = 0.02  # ±0.02mm

    @classmethod
    def check_diameter_tolerance(
        cls, geometry: CueDesignGeometry
    ) -> List[Dict[str, Any]]:
        """Check diameter tolerances for manufacturability"""
        issues = []

        for section in geometry.sections:
            # Check if taper is within tolerance
            diameter_change = abs(section.end_radius - section.start_radius) * 2

            if section.length > 0:
                taper_per_inch = diameter_change / section.length
                if taper_per_inch > 1.0:  # More than 1mm per inch
                    issues.append(
                        {
                            "section": section.section_type,
                            "issue": "excessive_taper",
                            "value": taper_per_inch,
                            "tolerance": 1.0,
                            "unit": "mm/in",
                        }
                    )

        return issues

    @classmethod
    def check_transition_smoothness(
        cls, geometry: CueDesignGeometry
    ) -> List[Dict[str, Any]]:
        """Check if transitions between sections are smooth enough"""
        issues = []

        if len(geometry.sections) < 2:
            return issues

        for i in range(len(geometry.sections) - 1):
            current = geometry.sections[i]
            next_section = geometry.sections[i + 1]

            diameter_diff = abs(current.end_radius * 2 - next_section.start_radius * 2)

            if diameter_diff > cls.DIAMETER_TOLERANCE * 2:
                issues.append(
                    {
                        "transition": f"{current.section_type} to {next_section.section_type}",
                        "issue": "abrupt_diameter_change",
                        "value": diameter_diff,
                        "tolerance": cls.DIAMETER_TOLERANCE * 2,
                        "unit": "mm",
                    }
                )

        return issues
