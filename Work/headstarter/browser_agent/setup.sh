#!/bin/bash

# Voice Browser Agent Setup Script
# This script sets up the development environment

set -e

echo "🚀 Setting up Voice Browser Agent..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Check if Node.js is installed (for local development)
check_node() {
    if ! command -v node &> /dev/null; then
        print_warning "Node.js is not installed. You'll need it for local frontend development."
        print_warning "Install Node.js 18+ from https://nodejs.org/"
    else
        NODE_VERSION=$(node --version)
        print_success "Node.js is installed: $NODE_VERSION"
    fi
}

# Check if Python is installed (for local development)
check_python() {
    if ! command -v python3 &> /dev/null; then
        print_warning "Python 3 is not installed. You'll need it for local backend development."
        print_warning "Install Python 3.11+ from https://python.org/"
    else
        PYTHON_VERSION=$(python3 --version)
        print_success "Python is installed: $PYTHON_VERSION"
    fi
}

# Create environment file
setup_env() {
    if [ ! -f .env ]; then
        print_status "Creating environment file..."
        cp env.example .env
        print_success "Environment file created. Please edit .env with your API keys."
        print_warning "You need to set OPENAI_API_KEY in .env for voice features to work."
    else
        print_success "Environment file already exists"
    fi
}

# Install frontend dependencies
install_frontend_deps() {
    if [ -d "frontend" ]; then
        print_status "Installing frontend dependencies..."
        cd frontend
        if [ -f "package.json" ]; then
            npm install
            print_success "Frontend dependencies installed"
        else
            print_warning "No package.json found in frontend directory"
        fi
        cd ..
    else
        print_warning "Frontend directory not found"
    fi
}

# Install backend dependencies
install_backend_deps() {
    if [ -d "backend" ]; then
        print_status "Installing backend dependencies..."
        cd backend
        if [ -f "requirements.txt" ]; then
            pip3 install -r requirements.txt
            print_success "Backend dependencies installed"
        else
            print_warning "No requirements.txt found in backend directory"
        fi
        cd ..
    else
        print_warning "Backend directory not found"
    fi
}

# Build Docker images
build_docker() {
    print_status "Building Docker images..."
    docker-compose build
    print_success "Docker images built successfully"
}

# Start services
start_services() {
    print_status "Starting services..."
    docker-compose up -d
    print_success "Services started successfully"
    
    print_status "Waiting for services to be ready..."
    sleep 10
    
    # Check if services are running
    if curl -f http://localhost:8000/health &> /dev/null; then
        print_success "Backend is running at http://localhost:8000"
    else
        print_warning "Backend might not be ready yet. Check logs with: docker-compose logs backend"
    fi
    
    if curl -f http://localhost:3000 &> /dev/null; then
        print_success "Frontend is running at http://localhost:3000"
    else
        print_warning "Frontend might not be ready yet. Check logs with: docker-compose logs frontend"
    fi
}

# Show status
show_status() {
    echo ""
    echo "🎉 Setup Complete!"
    echo ""
    echo "📋 Service URLs:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend API: http://localhost:8000"
    echo "  API Docs: http://localhost:8000/docs"
    echo ""
    echo "🔧 Useful Commands:"
    echo "  View logs: docker-compose logs -f"
    echo "  Stop services: docker-compose down"
    echo "  Restart services: docker-compose restart"
    echo "  Rebuild: docker-compose up --build"
    echo ""
    echo "⚠️  Important:"
    echo "  - Make sure to set OPENAI_API_KEY in .env for voice features"
    echo "  - Set BROWSERBASE_API_KEY for cloud browser automation (optional)"
    echo ""
}

# Main setup function
main() {
    echo "🔍 Checking prerequisites..."
    check_docker
    check_node
    check_python
    
    echo ""
    echo "⚙️  Setting up environment..."
    setup_env
    
    echo ""
    echo "📦 Installing dependencies..."
    install_frontend_deps
    install_backend_deps
    
    echo ""
    echo "🐳 Building and starting services..."
    build_docker
    start_services
    
    show_status
}

# Run main function
main "$@"
