#!/bin/bash

# Sikhiya Offline - Development Setup Script
# This script sets up the complete development environment

set -e  # Exit on any error

echo "🚀 Setting up Sikhiya Offline Development Environment"
echo "======================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if running from project root
if [ ! -f "package.json" ] && [ ! -f "docker-compose.yml" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check system requirements
print_step "Checking system requirements..."

# Check Docker
if ! command -v docker &> /dev/null; then
    print_error "Docker is required but not installed"
    echo "Please install Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is required but not installed"
    echo "Please install Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

print_success "Docker and Docker Compose are installed"

# Check Node.js
if ! command -v node &> /dev/null; then
    print_warning "Node.js is not installed locally (Docker will handle backend)"
else
    NODE_VERSION=$(node --version)
    print_success "Node.js version: $NODE_VERSION"
fi

# Check Flutter (optional for development)
if ! command -v flutter &> /dev/null; then
    print_warning "Flutter is not installed locally"
    echo "To develop the mobile app locally, install Flutter: https://flutter.dev/docs/get-started/install"
else
    FLUTTER_VERSION=$(flutter --version | head -n 1)
    print_success "Flutter: $FLUTTER_VERSION"
fi

# Setup backend environment
print_step "Setting up backend environment..."

cd backend

if [ ! -f ".env" ]; then
    cp .env.example .env
    print_success "Created backend/.env from .env.example"
    print_warning "Please review and update the .env file with your settings"
else
    print_success "Backend .env file already exists"
fi

cd ..

# Setup mobile environment (if Flutter is available)
if command -v flutter &> /dev/null; then
    print_step "Setting up mobile environment..."
    
    cd mobile
    
    print_step "Getting Flutter dependencies..."
    flutter pub get
    
    print_step "Generating code..."
    flutter pub run build_runner build --delete-conflicting-outputs
    
    cd ..
    
    print_success "Mobile environment setup complete"
fi

# Start Docker services
print_step "Starting Docker services..."

# Pull images first
docker-compose pull

# Start services
docker-compose up -d postgres redis pgadmin

print_step "Waiting for database to be ready..."
sleep 10

# Check if database is ready
until docker-compose exec postgres pg_isready -U sikhiya_user -d sikhiya_offline; do
    echo "Waiting for database..."
    sleep 2
done

print_success "Database is ready"

# Start backend service
print_step "Starting backend service..."
docker-compose up -d backend

# Wait for backend to be ready
sleep 5

# Health check
print_step "Performing health checks..."

# Check database connection
if docker-compose exec postgres psql -U sikhiya_user -d sikhiya_offline -c "SELECT 1;" > /dev/null 2>&1; then
    print_success "Database connection: OK"
else
    print_error "Database connection: FAILED"
fi

# Check backend API
if curl -s http://localhost:3000/health > /dev/null; then
    print_success "Backend API: OK"
else
    print_warning "Backend API: Not responding (may still be starting)"
fi

# Display service status
print_step "Service Status:"
docker-compose ps

echo ""
echo "🎉 Development environment setup complete!"
echo "======================================================"
echo ""
echo "📋 Available Services:"
echo "  • Backend API:     http://localhost:3000"
echo "  • Database:        postgres://sikhiya_user:sikhiya_password@localhost:5432/sikhiya_offline"
echo "  • pgAdmin:         http://localhost:5050 (admin@sikhiya.local / admin123)"
echo "  • Redis:           redis://localhost:6379"
echo ""
echo "🔧 Development Commands:"
echo "  • View logs:       docker-compose logs -f"
echo "  • Stop services:   docker-compose down"
echo "  • Restart:         docker-compose restart"
echo "  • Clean rebuild:   docker-compose down -v && docker-compose up --build"
echo ""

if command -v flutter &> /dev/null; then
    echo "📱 Flutter Development:"
    echo "  • Run mobile app:  cd mobile && flutter run"
    echo "  • Run web app:     cd mobile && flutter run -d chrome"
    echo "  • Run tests:       cd mobile && flutter test"
    echo ""
fi

echo "📖 Next Steps:"
echo "  1. Review and update backend/.env if needed"
echo "  2. Visit http://localhost:3000/health to verify backend"
echo "  3. Check the README.md for detailed development instructions"
echo "  4. Start coding! 🚀"
echo ""

# Check if .env needs attention
if grep -q "change-this" backend/.env 2>/dev/null; then
    print_warning "Remember to update the JWT secrets in backend/.env"
fi

print_success "Setup script completed successfully!"