#!/bin/bash
# Start JARVIS Backend
# Run this to start the server

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Activate venv
source venv/bin/activate

# Load .env if it exists
if [ -f ".env" ]; then
    set -a
    source .env
    set +a
fi

# Start the backend
echo "Starting JARVIS Backend on port 8000..."
python unified_backend.py
