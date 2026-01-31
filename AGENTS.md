# AGENTS.md - Cue Designer Development Guide

This document provides essential information for AI agents working on the Cue Designer project - a Django REST + React full-stack application for designing pool cue butt sections.

## Project Structure

```
cue-designer/
├── backend/                    # Django REST API
│   ├── cue_designer/          # Django settings
│   ├── cues/
│   │   ├── models.py          # Django ORM with 5 section types
│   │   ├── api/               # REST API (serializers, views)
│   │   ├── geometry/          # Pure Python geometry logic
│   │   └── rendering/         # SVG generation
│   └── tests/                 # Backend tests
└── frontend/                   # React + TypeScript + Vite
    ├── src/
    │   ├── components/        # React components
    │   ├── pages/           # Route pages
    │   ├── hooks/           # Custom React hooks
    │   ├── services/         # API client
    │   ├── stores/          # Zustand state
    │   ├── types/           # TypeScript types
    │   └── utils/          # Utilities
    └── test-results/          # Test outputs
```

## Essential Commands

### Backend (Django)
**Location:** Run from `backend/` directory

```bash
# Install dependencies
uv sync --dev

# Database operations
uv run python manage.py makemigrations cues
uv run python manage.py migrate

# Development server
uv run python manage.py runserver

# Testing
uv run pytest tests/ -v --cov=cues --cov-report=html    # All tests with coverage
uv run pytest tests/test_cues.py::CueModelTests::test_cue_design_creation -v  # Single test

# Code quality
uv run black .                    # Format code
uv run ruff check .               # Lint code
uv run mypy cues/                 # Type checking
```

### Frontend (React + TypeScript)
**Location:** Run from `frontend/` directory

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build
npm run build

# Testing
npm run test                     # Run unit tests
npm run test:e2e                 # Run Playwright E2E tests

# Code quality
npm run lint                     # ESLint
```

### Full-Stack Development
Run both servers in separate terminals:
- Terminal 1: `cd backend && uv run python manage.py runserver`
- Terminal 2: `cd frontend && npm run dev`

## Code Style & Conventions

### Python Backend

**Imports:**
- Standard library first, then third-party, then local imports
- Use `from django.db import models` style
- Group related imports with blank lines between groups

**Naming:**
- Classes: `PascalCase` (e.g., `CueDesign`, `CueSection`)
- Functions/variables: `snake_case` (e.g., `validate_section`, `outer_diameter_mm`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `SECTION_TYPES`)
- Model fields: descriptive names with units (e.g., `overall_length_in`, `diameter_mm`)

**Code Style:**
- Line length: 88 characters (Black formatting)
- Type hints required for all functions
- Use f-strings for string formatting
- Django models: use `choices` tuples for enumerated fields
- Validation: implement `clean()` methods with proper ValidationError messages

**Error Handling:**
- Use Django's `ValidationError` for model validation
- Raise specific exceptions with descriptive messages
- Handle geometry validation in `cues/geometry/validators.py`

### TypeScript Frontend

**Imports:**
- React imports first: `import React from 'react'`
- Third-party libraries next
- Local imports last, grouped by type (components, hooks, types, utils)

**Naming:**
- Components: `PascalCase` (e.g., `CueEditor`, `GeometryCanvas`)
- Functions/variables: `camelCase` (e.g., `validateSection`, `outerDiameterMm`)
- Types/interfaces: `PascalCase` (e.g., `CueDesign`, `CueSection`)
- Constants: `UPPER_SNAKE_CASE`

**Code Style:**
- Use TypeScript interfaces for all data structures
- Prefer functional components with hooks
- Use explicit return types for functions
- Use ES6+ features (destructuring, arrow functions, template literals)

**State Management:**
- Use Zustand for global state
- React Query for server state
- Local state with useState/useReducer

## Testing Guidelines

### Backend Testing
- Use Django's `TestCase` and `APITestCase`
- Test models, API endpoints, and geometry calculations separately
- Follow test naming: `test_<functionality>_description`
- Use descriptive test method names with underscores
- Test both happy path and error cases

**Single Test Example:**
```bash
uv run pytest tests/test_cues.py::CueModelTests::test_cue_design_creation -v
```

### Frontend Testing
- Unit tests with Vitest and Testing Library
- E2E tests with Playwright
- Test component rendering, user interactions, and API integration

## Data Model Constraints

### Section Types & Validation
- **Sequence:** joint → forearm → handle → sleeve → butt (must be ordered)
- **Length constraints:** joint (0.5-2"), forearm (8-14"), handle (8-12"), sleeve (4-8"), butt (2-6")
- **Diameter limits:** 18-32mm depending on section type
- **Manufacturing rules:** Max 5° taper, max 1mm diameter jumps between sections

### Key Models
- **CueDesign:** Main design with shaft specifications
- **CueSection:** Individual sections with materials, joints, and properties
- **InlayPattern:** Complex nested structure for decorative elements

## API Conventions

- RESTful design with `/api/v1/` prefix
- Use DRF serializers for data validation
- Nested relationships for sections within designs
- Custom endpoints for geometry validation and SVG export
- HTTP status codes: 201 for creation, 200 for success, 400 for validation errors

## Frontend Architecture

- **Routing:** React Router with `/` for list, `/cues/:id/edit` for editing
- **Components:** Functional components with TypeScript
- **State:** Zustand for design state, React Query for API calls
- **Styling:** Tailwind CSS (if configured)
- **Build:** Vite with React plugin

## Development Workflow

1. Make backend changes → run tests → create migrations if needed
2. Update frontend types to match backend models
3. Update API client calls in services/
4. Update React components/stores
5. Test full-stack functionality
6. Run linting and type checking on both backend and frontend

## Key File Locations

- **Backend models:** `backend/cues/models.py`
- **Backend validation:** `backend/cues/geometry/validators.py`
- **Frontend types:** `frontend/src/types/cue.ts`
- **Frontend components:** `frontend/src/components/`
- **API client:** `frontend/src/services/`
- **Tests:** `backend/tests/` and `frontend/src/test/`

## Common Pitfalls

- Always run migrations after model changes
- Keep frontend types in sync with backend models
- Test section sequence validation thoroughly
- Validate manufacturing constraints in both backend and frontend
- Use proper units (inches for length, mm for diameters)
- Handle optional fields properly in TypeScript interfaces