# UV Quick Start Guide for Cue Designer

## 🚀 Using UV for Python Dependency Management

The project is now configured to use `uv` for fast, modern Python dependency management.

### Initial Setup (Already Done)
```bash
# Dependencies are already synced
uv sync --dev

# Migrations have been applied
uv run python manage.py makemigrations cues
uv run python manage.py migrate
```

### Start Development Server
```bash
uv run python manage.py runserver
```

### Development Commands with UV

#### Database Operations
```bash
# Create new migrations
uv run python manage.py makemigrations

# Apply migrations
uv run python manage.py migrate

# Create superuser
uv run python manage.py createsuperuser

# Django shell
uv run python manage.py shell
```

#### Testing
```bash
# Run all tests
uv run pytest

# Run with coverage
uv run pytest --cov=cues --cov-report=html

# Run specific test
uv run pytest tests/test_cues.py::CueModelTests::test_cue_design_creation
```

#### Code Quality
```bash
# Format code
uv run black .

# Lint code
uv run ruff check .

# Type checking
uv run mypy cues/

# Fix linting issues
uv run ruff check --fix .
```

#### Dependency Management
```bash
# Add new dependency
uv add "package-name>=1.0.0"

# Add dev dependency
uv add --dev "pytest-cov>=4.0.0"

# Update dependencies
uv sync

# Remove dependency
uv remove package-name

# Show dependency tree
uv tree
```

### Access Points

Once server is running (`uv run python manage.py runserver`):

- **API**: http://127.0.0.1:8000/api/v1/
- **Admin**: http://127.0.0.1:8000/admin/
- **Django Browsable API**: http://127.0.0.1:8000/api/v1/cues/

### Example API Usage

#### Create Cue Design
```bash
curl -X POST http://127.0.0.1:8000/api/v1/cues/ \
  -H "Content-Type: application/json" \
  -d '{
    "cue_id": "UV_DEMO_001",
    "design_style": "modern_minimal",
    "overall_length_in": 29.0,
    "symmetry_type": "radial",
    "era_influence": "modern",
    "complexity_level": "low"
  }'
```

#### Test with Sections
```bash
curl -X POST http://127.0.0.1:8000/api/v1/cues/ \
  -H "Content-Type: application/json" \
  -d '{
    "cue_id": "UV_DEMO_002",
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
        "section_id": "SEC_HANDLE",
        "section_type": "handle", 
        "start_position_in": 11.0,
        "end_position_in": 21.5,
        "outer_diameter_start_mm": 20.2,
        "outer_diameter_end_mm": 24.0
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

#### Get SVG Profile
```bash
# After creating a design, get its SVG profile
curl http://127.0.0.1:8000/api/svg/UV_DEMO_002/ -o cue_design.svg
```

### Environment Setup

#### Virtual Environment
`uv` automatically manages a virtual environment in `.venv/`. All commands use `uv run` to ensure the correct environment is used.

#### Environment Variables
Set up environment variables in `.env` (create if needed):
```bash
# .env
DEBUG=True
SECRET_KEY=your-secret-key-here
```

### Development Workflow

#### 1. Make Changes
Edit your code with your preferred editor.

#### 2. Run Tests
```bash
uv run pytest
```

#### 3. Check Code Quality
```bash
uv run ruff check .
uv run black --check .
```

#### 4. Fix Issues
```bash
uv run ruff check --fix .
uv run black .
```

#### 5. Run Server
```bash
uv run python manage.py runserver
```

### Production Considerations

#### Installing Dependencies
```bash
# Install only production dependencies
uv sync --no-dev
```

#### Environment Variables
```bash
export DEBUG=False
export SECRET_KEY=your-production-secret
export DJANGO_SETTINGS_MODULE=cue_designer.settings.production
```

### Troubleshooting UV

#### UV Not Found
```bash
# Install UV (Windows PowerShell)
irm https://astral.sh/uv/install.ps1 | iex

# Or on Linux/Mac
curl -LsSf https://astral.sh/uv/install.sh | sh
```

#### Dependency Conflicts
```bash
# Reset and re-sync
uv sync --refresh

# Clear cache
uv cache clean
```

#### Import Errors
```bash
# Ensure all dependencies are installed
uv sync --dev

# Restart server
uv run python manage.py runserver
```

### VS Code Integration

Add this to your `.vscode/settings.json`:
```json
{
    "python.defaultInterpreterPath": "./.venv/Scripts/python.exe",
    "python.linting.enabled": true,
    "python.linting.ruffEnabled": true,
    "python.formatting.provider": "black",
    "python.testing.pytestEnabled": true,
    "python.testing.pytestArgs": ["tests"]
}
```

## 🎱 Ready to Go!

Your cue designer application is now running with `uv` for dependency management. The server is available at **http://127.0.0.1:8000/** with full API and admin functionality.