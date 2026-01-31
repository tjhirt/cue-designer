from django.test import TestCase
from django.core.exceptions import ValidationError
from rest_framework.test import APITestCase
from rest_framework import status
from cues.models import CueDesign, CueSection
from cues.geometry.core import Point3D, CueSectionGeometry, CueDesignGeometry
from cues.geometry.validators import CueGeometryValidator


class CueModelTests(TestCase):
    def test_cue_design_creation(self):
        """Test basic cue design creation"""
        cue = CueDesign.objects.create(
            cue_id="TEST_001",
            design_style="modern_minimal",
            overall_length_in=29.0,
            symmetry_type="radial",
            era_influence="modern",
            complexity_level="low",
        )

        self.assertEqual(cue.cue_id, "TEST_001")
        self.assertEqual(cue.design_style, "modern_minimal")
        self.assertEqual(cue.overall_length_in, 29.0)

    def test_cue_design_validation(self):
        """Test cue design validation"""
        # Test negative length
        with self.assertRaises(ValidationError):
            cue = CueDesign(
                cue_id="TEST_002",
                design_style="modern_minimal",
                overall_length_in=-5.0,
                symmetry_type="radial",
                era_influence="modern",
                complexity_level="low",
            )
            cue.full_clean()

    def test_cue_section_creation(self):
        """Test cue section creation"""
        cue = CueDesign.objects.create(
            cue_id="TEST_003",
            design_style="modern_minimal",
            overall_length_in=29.0,
            symmetry_type="radial",
            era_influence="modern",
            complexity_level="low",
        )

        section = CueSection.objects.create(
            cue_design=cue,
            section_id="SEC_FOREARM",
            section_type="forearm",
            start_position_in=0.0,
            end_position_in=11.0,
            outer_diameter_start_mm=21.3,
            outer_diameter_end_mm=20.2,
        )

        self.assertEqual(section.section_type, "forearm")
        self.assertEqual(section.length_in, 11.0)
        self.assertAlmostEqual(section.taper_rate_mm_per_in, -0.1, places=2)


class GeometryTests(TestCase):
    def test_point3d_creation(self):
        """Test Point3D creation and operations"""
        point = Point3D(x=10.0, r=5.0, theta=0.0)
        self.assertEqual(point.x, 10.0)
        self.assertEqual(point.r, 5.0)
        self.assertEqual(point.theta, 0.0)

        # Test distance calculation
        other = Point3D(x=15.0, r=5.0, theta=0.0)
        distance = point.distance_to(other)
        self.assertEqual(distance, 5.0)

    def test_cue_section_geometry(self):
        """Test CueSectionGeometry calculations"""
        start = Point3D(0.0, 10.0)
        end = Point3D(10.0, 8.0)
        section = CueSectionGeometry("forearm", start, end)

        self.assertEqual(section.length, 10.0)
        self.assertEqual(section.start_radius, 10.0)
        self.assertEqual(section.end_radius, 8.0)
        self.assertEqual(section.taper_rate, -0.2)

        # Test radius at position
        radius_at_5 = section.radius_at_position(5.0)
        self.assertEqual(radius_at_5, 9.0)

    def test_cue_design_geometry(self):
        """Test CueDesignGeometry with multiple sections"""
        section1 = CueSectionGeometry(
            "forearm", Point3D(0.0, 10.0), Point3D(10.0, 10.0)
        )
        section2 = CueSectionGeometry(
            "handle", Point3D(10.0, 10.0), Point3D(20.0, 12.0)
        )

        geometry = CueDesignGeometry([section1, section2])

        self.assertEqual(geometry.total_length, 20.0)
        self.assertEqual(len(geometry.sections), 2)

        # Test radius at different positions
        self.assertEqual(geometry.radius_at_position(5.0), 10.0)
        self.assertEqual(geometry.radius_at_position(15.0), 11.0)


class ValidatorTests(TestCase):
    def test_section_validation(self):
        """Test individual section validation"""
        # Valid section
        valid_section = {
            "section_type": "forearm",
            "start_position_in": 0.0,
            "end_position_in": 10.0,
            "outer_diameter_start_mm": 20.0,
            "outer_diameter_end_mm": 19.0,
        }

        issues = CueGeometryValidator.validate_section(valid_section)
        self.assertEqual(len(issues), 0)

        # Invalid section - start > end
        invalid_section = {
            "section_type": "forearm",
            "start_position_in": 10.0,
            "end_position_in": 5.0,
            "outer_diameter_start_mm": 20.0,
            "outer_diameter_end_mm": 19.0,
        }

        issues = CueGeometryValidator.validate_section(invalid_section)
        self.assertGreater(len(issues), 0)

    def test_continuity_validation(self):
        """Test section continuity validation"""
        sections = [
            {
                "section_type": "forearm",
                "start_position_in": 0.0,
                "end_position_in": 10.0,
                "outer_diameter_start_mm": 20.0,
                "outer_diameter_end_mm": 19.0,
            },
            {
                "section_type": "handle",
                "start_position_in": 11.0,  # Gap of 1 inch
                "end_position_in": 20.0,
                "outer_diameter_start_mm": 19.0,
                "outer_diameter_end_mm": 21.0,
            },
        ]

        issues = CueGeometryValidator.validate_sections_continuity(sections)
        self.assertGreater(len(issues), 0)
        self.assertTrue(any("gap" in issue.lower() for issue in issues))


class CueAPITests(APITestCase):
    def test_create_cue_design(self):
        """Test creating a cue design via API"""
        data = {
            "cue_id": "API_TEST_001",
            "design_style": "modern_minimal",
            "overall_length_in": 29.0,
            "symmetry_type": "radial",
            "era_influence": "modern",
            "complexity_level": "low",
            "notes": "Test cue design",
        }

        response = self.client.post("/api/v1/cues/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CueDesign.objects.count(), 1)

        cue = CueDesign.objects.first()
        self.assertEqual(cue.cue_id, "API_TEST_001")

    def test_cue_geometry_endpoint(self):
        """Test geometry validation endpoint"""
        # Create a cue design first
        cue = CueDesign.objects.create(
            cue_id="GEOM_TEST_001",
            design_style="modern_minimal",
            overall_length_in=29.0,
            symmetry_type="radial",
            era_influence="modern",
            complexity_level="low",
        )

        # Add sections
        CueSection.objects.create(
            cue_design=cue,
            section_id="SEC_FOREARM",
            section_type="forearm",
            start_position_in=0.0,
            end_position_in=11.0,
            outer_diameter_start_mm=21.3,
            outer_diameter_end_mm=20.2,
        )

        response = self.client.get(f"/api/v1/cues/{cue.id}/geometry/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()
        self.assertIn("total_length", data)
        self.assertIn("sections_count", data)
        self.assertIn("continuity_validation", data)
        self.assertIn("manufacturing_validation", data)
