# Cue Designer - Django REST API

A Django REST application for designing the butt sections of pool cues (forearm, handle, butt sleeve only). The application is deterministic, user-driven, schema-first, geometry-based, and oriented toward SVG/CAD output.

## Features

- **Schema-First Design**: Strict adherence to the provided cue design schema
- **Geometry-Based**: Custom geometry classes for precise calculations
- **Manufacturing Validation**: Real-world manufacturing constraint checking
- **SVG Generation**: Visual profile views of cue designs
- **Django REST API**: Full CRUD operations for cue designs
- **Admin Interface**: Django admin for data management

## Quick Start with UV

### Prerequisites
- Python 3.14+
- [UV](https://docs.astral.sh/uv/getting-started/installation/) dependency manager

### Installation

1. Clone the repository
2. Install dependencies with UV:
   ```bash
   uv sync --dev
   ```

3. Run migrations:
   ```bash
   uv run python manage.py migrate
   ```

4. Create superuser (optional):
   ```bash
   uv run python manage.py createsuperuser
   ```

5. Start development server:
   ```bash
   uv run python manage.py runserver
   ```

### Quick Start Scripts

#### Windows PowerShell
```powershell
.\start.ps1
```

#### Windows/Unix Bash
```bash
./start.sh
```

#### Manual Steps
```bash
uv sync --dev
uv run python manage.py migrate
uv run python manage.py runserver
```

## API Endpoints

### Cue Designs
- `GET /api/v1/cues/` - List all cue designs
- `POST /api/v1/cues/` - Create new cue design
- `GET /api/v1/cues/{id}/` - Get specific cue design
- `PUT /api/v1/cues/{id}/` - Update cue design
- `DELETE /api/v1/cues/{id}/` - Delete cue design

### Geometry Operations
- `GET /api/v1/cues/{id}/geometry/` - Get geometry validation info
- `GET /api/v1/cues/{id}/profile-data/` - Get profile data for rendering
- `GET /api/svg/{cue_id}/` - Get SVG profile view

### Cue Sections
- `GET /api/v1/sections/` - List all sections
- `POST /api/v1/sections/` - Create new section
- `GET /api/v1/sections/{id}/` - Get specific section
- `PUT /api/v1/sections/{id}/` - Update section
- `DELETE /api/v1/sections/{id}/` - Delete section

## Data Model

### Cue Design Schema

```json
{
  "cue_id": "CUE_0023",
  "design_style": "modern_minimal",
  "overall_length_in": 29.0,
  "symmetry_type": "radial",
  "era_influence": "modern",
  "complexity_level": "low",
  "sections": [
    {
      "section_id": "SEC_FOREARM",
      "section_type": "forearm",
      "start_position_in": 0.0,
      "end_position_in": 11.0,
      "outer_diameter_start_mm": 21.3,
      "outer_diameter_end_mm": 20.2,
      "inlay_patterns": []
    }
  ]
}
```

### Section Types
- `forearm` - The front section of the cue butt
- `handle` - The middle gripping section
- `butt_sleeve` - The rear section with weight

### Design Styles
- `traditional_classic` - Classic traditional designs
- `modern_minimal` - Clean, minimalist modern designs
- `ornate` - Highly decorative, complex designs
- `art_deco` - Art Deco inspired designs
- `contemporary` - Modern contemporary styles

## Geometry Validation

The application includes comprehensive validation for:

### Manufacturing Constraints
- **Taper angles**: Maximum 5° taper angle
- **Radius limits**: 5mm minimum, 25mm maximum radius
- **Section lengths**: 2" minimum, 20" maximum per section
- **Total length**: Maximum 40" for butt section
- **Diameter jumps**: Maximum 1mm change between sections

### Section Continuity
- **Gap detection**: Identifies gaps between sections
- **Overlap prevention**: Prevents section overlaps
- **Smooth transitions**: Validates smooth diameter transitions

## Example Usage

### Create a Cue Design

```bash
curl -X POST http://localhost:8000/api/v1/cues/ \
  -H "Content-Type: application/json" \
  -d '{
    "cue_id": "EXAMPLE_001",
    "design_style": "modern_minimal",
    "overall_length_in": 29.0,
    "symmetry_type": "radial",
    "era_influence": "modern",
    "complexity_level": "low",
    "sections": [
      {
        "section_id": "SEC_FOREARM",
        "section_type": "forearm",
        "start_position_in": 0.0,
        "end_position_in": 11.0,
        "outer_diameter_start_mm": 21.3,
        "outer_diameter_end_mm": 20.2
      },
      {
        "section_id": "SEC_SLEEVE",
        "section_type": "butt_sleeve",
        "start_position_in": 21.5,
        "end_position_in": 27.0,
        "outer_diameter_start_mm": 30.0,
        "outer_diameter_end_mm": 30.0
      }
    ]
  }'
```

### Get SVG Profile

```bash
curl http://localhost:8000/api/svg/EXAMPLE_001/
```

### Validate Geometry

```bash
curl http://localhost:8000/api/v1/cues/1/geometry/
```

## Architecture

### Project Structure
```
cue_designer/
├── manage.py
├── cue_designer/           # Django project settings
├── cues/                   # Main Django app
│   ├── models.py          # Cue design models
│   ├── api/               # REST API components
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── geometry/          # Geometry logic (separate from web)
│   │   ├── core.py        # Core geometry classes
│   │   ├── validators.py  # Manufacturing constraints
│   │   └── operations.py  # Advanced geometry operations
│   ├── rendering/         # SVG generation
│   │   ├── svg_generator.py
│   │   └── coordinate_transform.py
│   └── services.py        # Business logic layer
└── tests/                 # Test suite
```

### Key Components

#### Geometry Core (`cues/geometry/core.py`)
- `Point3D` - 3D points in axial/radial/rotational coordinates
- `CueSectionGeometry` - Individual section geometry
- `CueDesignGeometry` - Complete cue design geometry

#### Validators (`cues/geometry/validators.py`)
- `CueGeometryValidator` - Manufacturing constraint validation
- `InlayPatternValidator` - Pattern structure validation

#### Rendering (`cues/rendering/`)
- `SVGGenerator` - Profile view SVG generation
- `CoordinateTransform` - Geometry to SVG coordinate conversion

## Development

### Running Tests
```bash
python manage.py test
```

### Creating Migrations
```bash
python manage.py makemigrations
```

### Django Admin
Access the admin interface at `http://localhost:8000/admin/` for data management.

## Manufacturing Integration

The geometry validation system ensures designs are physically manufacturable:

### Real-World Constraints
- Maximum taper angles for wood stability
- Minimum radius for structural integrity
- Maximum diameter for playability
- Smooth transitions for comfort

### Tolerance Checking
- Diameter tolerances: ±0.05mm
- Length tolerances: ±0.1mm
- Taper tolerances: ±0.5°
- Concentricity tolerances: ±0.02mm

## Future Enhancements

### Phase 2: Inlay Patterns
- Pattern placement and validation
- Material assignment tracking
- Enhanced SVG rendering with inlays

### Phase 3: Export Formats
- DXF export for CAD software
- STEP format for 3D manufacturing
- Material cut lists

### Phase 4: Advanced Features
- Weight and balance calculations
- Cost estimation
- Production planning integration

## License

[Add your license information here]

## Contributing

[Add contribution guidelines here]