import math
from typing import Tuple, Optional, List
from dataclasses import dataclass


@dataclass
class Point3D:
    """3D point in axial (X), radial (R), rotational (θ) coordinates"""

    x: float  # Axial position along cue length (inches)
    r: float  # Radial distance from centerline (mm)
    theta: float = 0.0  # Rotational angle (degrees)

    def to_cartesian(self) -> Tuple[float, float, float]:
        """Convert to Cartesian coordinates for calculations"""
        theta_rad = math.radians(self.theta)
        x = self.x
        y = self.r * math.cos(theta_rad)
        z = self.r * math.sin(theta_rad)
        return x, y, z

    def distance_to(self, other: "Point3D") -> float:
        """Calculate Euclidean distance to another point"""
        dx = self.x - other.x
        dy = self.r * math.cos(math.radians(self.theta)) - other.r * math.cos(
            math.radians(other.theta)
        )
        dz = self.r * math.sin(math.radians(self.theta)) - other.r * math.sin(
            math.radians(other.theta)
        )
        return math.sqrt(dx**2 + dy**2 + dz**2)


@dataclass
class Vector3D:
    """3D vector for geometric operations"""

    x: float
    y: float
    z: float

    def magnitude(self) -> float:
        return math.sqrt(self.x**2 + self.y**2 + self.z**2)

    def normalize(self) -> "Vector3D":
        mag = self.magnitude()
        if mag == 0:
            return Vector3D(0, 0, 0)
        return Vector3D(self.x / mag, self.y / mag, self.z / mag)

    def dot(self, other: "Vector3D") -> float:
        return self.x * other.x + self.y * other.y + self.z * other.z

    def cross(self, other: "Vector3D") -> "Vector3D":
        return Vector3D(
            self.y * other.z - self.z * other.y,
            self.z * other.x - self.x * other.z,
            self.x * other.y - self.y * other.x,
        )


class CueSectionGeometry:
    """Geometric representation of a cue section"""

    def __init__(self, section_type: str, start: Point3D, end: Point3D):
        self.section_type = section_type
        self.start = start
        self.end = end

    @property
    def length(self) -> float:
        """Section length in inches"""
        return self.end.x - self.start.x

    @property
    def start_radius(self) -> float:
        """Starting radius in mm"""
        return self.start.r

    @property
    def end_radius(self) -> float:
        """Ending radius in mm"""
        return self.end.r

    @property
    def taper_rate(self) -> float:
        """Taper rate in mm per inch"""
        if self.length == 0:
            return 0.0
        return (self.end_radius - self.start_radius) / self.length

    @property
    def taper_angle_degrees(self) -> float:
        """Taper angle in degrees"""
        if self.length == 0:
            return 0.0
        return math.degrees(math.atan(self.taper_rate / 25.4))  # Convert mm to inches

    def radius_at_position(self, x_position: float) -> float:
        """Calculate radius at a given axial position"""
        if x_position < self.start.x or x_position > self.end.x:
            raise ValueError(f"Position {x_position} is outside section range")

        # Linear interpolation of radius
        t = (x_position - self.start.x) / self.length
        return self.start_radius + t * (self.end_radius - self.start_radius)

    def surface_area(self) -> float:
        """Calculate lateral surface area in square inches"""
        avg_radius_mm = (self.start_radius + self.end_radius) / 2
        avg_radius_in = avg_radius_mm / 25.4  # Convert to inches
        circumference = 2 * math.pi * avg_radius_in
        return circumference * self.length

    def volume(self) -> float:
        """Calculate volume in cubic inches"""
        # Frustum of a cone formula
        r1_in = self.start_radius / 25.4
        r2_in = self.end_radius / 25.4
        h = self.length

        return (1 / 3) * math.pi * h * (r1_in**2 + r1_in * r2_in + r2_in**2)


class CueDesignGeometry:
    """Geometric representation of a complete cue design"""

    def __init__(self, sections: List[CueSectionGeometry]):
        self.sections = sorted(sections, key=lambda s: s.start.x)

    @property
    def total_length(self) -> float:
        """Total cue length in inches"""
        if not self.sections:
            return 0.0
        return self.sections[-1].end.x - self.sections[0].start.x

    @property
    def sections_by_type(self) -> dict:
        """Group sections by type"""
        result = {}
        for section in self.sections:
            if section.section_type not in result:
                result[section.section_type] = []
            result[section.section_type].append(section)
        return result

    def get_section_at_position(
        self, x_position: float
    ) -> Optional[CueSectionGeometry]:
        """Find section containing given position"""
        for section in self.sections:
            if section.start.x <= x_position <= section.end.x:
                return section
        return None

    def radius_at_position(self, x_position: float) -> float:
        """Calculate radius at any position along the cue"""
        section = self.get_section_at_position(x_position)
        if section:
            return section.radius_at_position(x_position)
        raise ValueError(f"Position {x_position} is outside cue design")

    def validate_continuity(self) -> List[str]:
        """Validate section continuity and return list of issues"""
        issues = []

        if len(self.sections) < 2:
            return issues

        for i in range(len(self.sections) - 1):
            current = self.sections[i]
            next_section = self.sections[i + 1]

            # Check for gaps
            if abs(current.end.x - next_section.start.x) > 0.001:  # Small tolerance
                issues.append(
                    f"Gap between {current.section_type} and {next_section.section_type}"
                )

            # Check for radius jumps
            radius_diff = abs(current.end_radius - next_section.start_radius)
            if radius_diff > 0.1:  # More than 0.1mm jump
                issues.append(
                    f"Large radius jump between {current.section_type} and {next_section.section_type}"
                )

        return issues

    def validate_manufacturing_constraints(self) -> List[str]:
        """Validate manufacturing constraints"""
        issues = []

        for section in self.sections:
            # Check taper angle
            if abs(section.taper_angle_degrees) > 5.0:  # Max 5 degrees
                issues.append(
                    f"{section.section_type} taper angle too steep: {section.taper_angle_degrees:.2f}°"
                )

            # Check minimum radius
            min_radius = min(section.start_radius, section.end_radius)
            if min_radius < 5.0:  # Minimum 5mm radius
                issues.append(
                    f"{section.section_type} radius too small: {min_radius:.2f}mm"
                )

            # Check maximum radius
            max_radius = max(section.start_radius, section.end_radius)
            if max_radius > 25.0:  # Maximum 25mm radius
                issues.append(
                    f"{section.section_type} radius too large: {max_radius:.2f}mm"
                )

        return issues
