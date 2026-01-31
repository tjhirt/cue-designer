#!/bin/bash
# UV-based startup script for Cue Designer

echo "🎱 Starting Cue Designer with UV..."
echo "================================"

# Check if uv is installed
if ! command -v uv &> /dev/null; then
    echo "❌ UV is not installed. Please install it first:"
    echo "   PowerShell: irm https://astral.sh/uv/install.ps1 | iex"
    echo "   Bash: curl -LsSf https://astral.sh/uv/install.sh | sh"
    exit 1
fi

# Ensure dependencies are installed
echo "📦 Syncing dependencies..."
uv sync --dev

# Ensure database is migrated
echo "🗄️  Running migrations..."
uv run python manage.py migrate

echo ""
echo "🚀 Starting development server..."
echo "   API: http://127.0.0.1:8000/api/v1/"
echo "   Admin: http://127.0.0.1:8000/admin/"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
uv run python manage.py runserver