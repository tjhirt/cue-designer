# Cue Designer - Django REST + React Full-Stack

A full-stack web application for designing pool cue butt sections (joint, forearm, handle, sleeve, butt). Features real-time validation, interactive UI, and SVG/CAD export capabilities.

## Architecture

```
cue-designer/
├── backend/                    # Django REST API
│   ├── cue_designer/          # Django settings
│   ├── cues/
│   │   ├── models.py          # Django ORM with 5 section types
│   │   ├── api/               # REST API (serializers, views)
│   │   ├── geometry/          # Pure Python geometry logic
│   │   ├── rendering/         # SVG generation
│   │   └── migrations/
│   ├── manage.py
│   ├── pyproject.toml
│   └── db.sqlite3
│
└── frontend/                   # React + TypeScript + Vite
    ├── src/
    │   ├── components/        # React components
    │   ├── pages/           # Route pages
    │   ├── hooks/           # Custom React hooks
    │   ├── services/         # API client
    │   ├── stores/          # Zustand state
    │   ├── types/           # TypeScript types
    │   └── utils/          # Utilities
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    └── .env
```

## Prerequisites

- Python 3.11+
- UV dependency manager
- Node.js 18+
- npm

## Quick Start

### Backend (Django)
```bash
cd backend

# Install dependencies
uv sync --dev

# Run migrations
uv run python manage.py migrate

# Start server
uv run python manage.py runserver
```

### Frontend (React)
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

## Development Commands

### Backend
```bash
# Create migrations
uv run python manage.py makemigrations cues

# Apply migrations
uv run python manage.py migrate

# Run tests
uv run pytest tests/ -v --cov=cues --cov-report=html

# Code quality
uv run black .
uv run ruff check .
uv run mypy cues/
```

### Frontend
```bash
# Install new dependencies
npm install <package-name>

# Run tests
npm run test

# Build for production
npm run build

# Run E2E tests
npm run test:e2e

# Lint code
npm run lint
```

## Running Both Servers

For full-stack development, run both servers in separate terminals:

**Terminal 1 (Backend):**
```bash
cd backend && uv run python manage.py runserver
```

**Terminal 2 (Frontend):**
```bash
cd frontend && npm run dev
```

## Project Structure Details

### Backend

**Models (`backend/cues/models.py`)**
- `CueDesign`: Main design model with shaft specifications
- `CueSection`: 5 section types (joint, forearm, handle, sleeve, butt)
- Added fields: joint config, materials, physical properties, QC status

**API (`backend/cues/api/`)**
- `CueDesignSerializer`: Full serializer with shaft fields
- `CueDesignCreateSerializer`: Nested section creation with validation
- `CueSectionSerializer`: Material, joint, and physical properties

**Validation (`backend/cues/geometry/validators.py`)**
- Section sequence validation (joint → forearm → handle → sleeve → butt)
- Section-specific constraints (min/max length and diameter per type)
- Manufacturing constraints (taper angle, radius limits)
- Inlay pattern validation

**Geometry (`backend/cues/geometry/core.py`)**
- `Point3D`: 3D points with axial/radial/rotational coordinates
- `CueSectionGeometry`: Individual section geometry
- `CueDesignGeometry`: Complete cue geometry

### Frontend

**Components (`frontend/src/components/`)**
- `cue-design/CueEditor.tsx`: Main editor interface
- `cue-design/GeometryCanvas.tsx`: SVG visualization
- `pages/CueList.tsx`: List of cue designs

**State Management (`frontend/src/stores/`)**
- `cueStore.ts`: Zustand store for cue design state

**API Client (`frontend/src/services/`)**
- `api.ts`: Axios client with interceptors
- `cues.ts`: Cue design API calls

**Hooks (`frontend/src/hooks/`)**
- `useCueDesigns.ts`: React Query hooks for CRUD operations

**Types (`frontend/src/types/`)**
- `cue.ts`: TypeScript interfaces for CueDesign, CueSection, etc.

## API Endpoints

### Backend
- `GET /api/v1/cues/` - List all cue designs
- `POST /api/v1/cues/` - Create new cue design
- `GET /api/v1/cues/{id}/` - Get specific cue design
- `PUT /api/v1/cues/{id}/` - Update cue design
- `DELETE /api/v1/cues/{id}/` - Delete cue design
- `GET /api/v1/cues/{id}/geometry/` - Get validation information
- `GET /api/v1/cues/{id}/profile-data/` - Get profile points
- `GET /api/svg/{cue_id}/` - Get SVG profile view

### Frontend Routes
- `/` - Cue design list
- `/cues/:id/edit` - Cue editor

## Data Model

### CueDesign
- `cue_id`: Unique identifier
- `design_style`: traditional_classic, modern_minimal, ornate, art_deco, contemporary
- `overall_length_in`: Total length in inches (max 40")
- `symmetry_type`: radial, bilateral, asymmetric
- `era_influence`: vintage, traditional, modern, contemporary
- `complexity_level`: low, medium, high
- `sections`: Array of CueSection objects
- `shaft_diameter_mm`: Shaft diameter at joint
- `shaft_length_in`: Total shaft length
- `tip_type`: leather, phenolic, layered
- `tip_size_mm`: Tip diameter

### CueSection
- `section_type`: joint, forearm, handle, sleeve, butt
- `start_position_in`: Start position in inches
- `end_position_in`: End position in inches
- `outer_diameter_start_mm`: Start diameter in mm
- `outer_diameter_end_mm`: End diameter in mm
- `joint_type`: 5/16-18, 3/8-10, radial, uni-loc, quick_release (joint only)
- `wood_species`: maple, ebony, rosewood, cocobolo, bubinga, purpleheart
- `wrap_type`: irish_linen, leather, synthetic, none (handle only)
- `wrap_color`: Color of wrap
- `finish_type`: oil, polyurethane, lacquer, wax
- `inlay_patterns`: Array of inlay pattern definitions
- `weight_oz`: Section weight in ounces
- `balance_point_in`: Distance from joint end to balance point
- `production_notes`: Manufacturing notes
- `qc_status`: pending, approved, rejected, in_production, completed

## Section Types & Constraints

| Section Type | Min Length | Max Length | Min Diameter | Max Diameter |
|---------------|-------------|-------------|---------------|---------------|
| joint         | 0.5"        | 2.0"        | 18mm         | 25mm         |
| forearm        | 8.0"        | 14.0"       | 19mm         | 24mm         |
| handle         | 8.0"        | 12.0"       | 20mm         | 26mm         |
| sleeve         | 4.0"        | 8.0"        | 24mm         | 32mm         |
| butt           | 2.0"        | 6.0"        | 26mm         | 32mm         |

## Manufacturing Constraints

- Taper angle: Maximum 5°
- Radius limits: 5mm minimum, 25mm maximum
- Section length: 2" minimum, 20" maximum
- Total length: 40" maximum
- Diameter jumps: Maximum 1mm between sections
- Sequence: joint → forearm → handle → sleeve → butt (must be ordered correctly)

## Development Workflow

1. Make backend changes
2. Run migrations
3. Update frontend types/stores
4. Test API endpoints
5. Update UI components
6. Test full-stack functionality

## Status

**Completed:**
- ✅ Phase 1: Fixed Python version (3.11), Django version (5.1), test config
- ✅ Phase 2: Added 5 section types, joint fields, material fields, physical properties
- ✅ Phase 3: Updated serializers, added validation (sequence, constraints, manufacturing)
- ✅ Phase 4: Frontend setup (React + Vite + TypeScript)
- ✅ Phase 5: Frontend components (CueEditor, GeometryCanvas, CueList)

**In Progress:**
- 🔄 Phase 6: Full integration testing

**Pending:**
- ⏳ Phase 7: Testing & polish, documentation updates

## Contributing

[Add contribution guidelines here]

## License

[Add license information here]
