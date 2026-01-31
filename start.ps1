# UV-based startup script for Cue Designer (Windows PowerShell)

Write-Host "🎱 Starting Cue Designer with UV..." -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Check if uv is installed
try {
    $uvVersion = uv --version
    Write-Host "✅ UV found: $uvVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ UV is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "   PowerShell: irm https://astral.sh/uv/install.ps1 | iex" -ForegroundColor Yellow
    exit 1
}

# Ensure dependencies are installed
Write-Host "📦 Syncing dependencies..." -ForegroundColor Blue
uv sync --dev

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to sync dependencies" -ForegroundColor Red
    exit 1
}

# Ensure database is migrated
Write-Host "🗄️  Running migrations..." -ForegroundColor Blue
uv run python manage.py migrate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to run migrations" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🚀 Starting development server..." -ForegroundColor Green
Write-Host "   API: http://127.0.0.1:8000/api/v1/" -ForegroundColor White
Write-Host "   Admin: http://127.0.0.1:8000/admin/" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the server
uv run python manage.py runserver