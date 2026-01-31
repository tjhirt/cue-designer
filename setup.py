#!/usr/bin/env python
"""
Django setup script for cue-designer application
"""

import os
import sys
import django
from django.conf import settings
from django.core.management import execute_from_command_line

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cue_designer.settings")
django.setup()

# Import models to ensure they're registered
from cues.models import CueDesign, CueSection


def setup_database():
    """Create initial database setup"""
    from django.core.management import call_command

    # Create migrations
    print("Creating migrations...")
    call_command("makemigrations", "cues")

    # Apply migrations
    print("Applying migrations...")
    call_command("migrate")

    # Create superuser (optional)
    print("\nTo create a superuser, run:")
    print("python manage.py createsuperuser")

    print("\nSetup complete!")
    print("To start the server, run:")
    print("python manage.py runserver")


if __name__ == "__main__":
    setup_database()
