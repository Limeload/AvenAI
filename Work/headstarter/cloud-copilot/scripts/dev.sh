#!/bin/bash

# CloudCopilot Development Script
set -e

echo "🚀 Starting CloudCopilot in development mode..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found. Please run ./scripts/setup.sh first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Start development servers
echo "🚀 Starting development servers..."

# Start backend in background
echo "Starting Flask backend..."
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py &
BACKEND_PID=$!
cd ..

# Start frontend
echo "Starting Next.js frontend..."
npm run dev &
FRONTEND_PID=$!

# Function to cleanup on exit
cleanup() {
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

echo "✅ Development servers started!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for processes
wait
