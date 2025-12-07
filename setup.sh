#!/bin/bash
# JARVIS Backend Setup Script
# Run this once to set everything up

echo "=== JARVIS Setup ==="

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# 1. Create virtual environment
echo "[1/4] Creating Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# 2. Install dependencies
echo "[2/4] Installing Python dependencies..."
pip install --quiet flask flask-cors flask-sock psutil pydantic gunicorn

# 3. Copy .env if it exists in parent JARVIS folder
if [ -f "../.env" ]; then
    echo "[3/4] Copying .env from parent folder..."
    # Clean the .env file - remove comments and empty lines
    grep -v '^#' "../.env" | grep -v '^$' | grep '=' > .env
    echo "API keys loaded!"
else
    echo "[3/4] No .env found. Copy .env.example to .env and add your keys."
    cp .env.example .env 2>/dev/null || true
fi

# 4. Install frontend dependencies
echo "[4/4] Installing frontend dependencies..."
cd frontend
npm install --silent
cd ..

echo ""
echo "=== Setup Complete! ==="
echo ""
echo "To start the backend:"
echo "  cd $SCRIPT_DIR"
echo "  source venv/bin/activate"
echo "  python unified_backend.py"
echo ""
echo "To start the frontend (in a new terminal):"
echo "  cd $SCRIPT_DIR/frontend"
echo "  npm run dev"
echo ""
