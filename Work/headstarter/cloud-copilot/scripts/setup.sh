#!/bin/bash

# CloudCopilot Setup Script
set -e

echo "🚀 Setting up CloudCopilot..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp env.example .env.local
    echo "⚠️  Please update .env.local with your actual environment variables"
fi

# Create .env file for backend if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend/.env file..."
    cat > backend/.env << EOF
FLASK_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cloudcopilot
REDIS_URL=redis://localhost:6379
EOF
    echo "⚠️  Please update backend/.env with your actual environment variables"
fi

# Build and start services
echo "🔨 Building Docker images..."
docker-compose build

echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services are running!"
    echo ""
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend: http://localhost:5000"
    echo "🗄️  Database: localhost:5432"
    echo "📊 Redis: localhost:6379"
    echo ""
    echo "📋 Next steps:"
    echo "1. Update .env.local with your API keys"
    echo "2. Run database migrations: docker-compose exec frontend npx prisma db push"
    echo "3. Visit http://localhost:3000 to see the application"
else
    echo "❌ Some services failed to start. Check logs with: docker-compose logs"
    exit 1
fi

echo "🎉 Setup complete!"
