#!/bin/bash

# Crimson NeoBank Setup Script
# Run this script to set up the entire application

echo "🚀 Setting up Crimson NeoBank..."

# Check if Docker is running
if ! docker --version &> /dev/null; then
    echo "❌ Docker not found. Please install Docker."
    exit 1
fi
echo "✅ Docker found: $(docker --version)"

# Check if Node.js is installed
if ! node --version &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+."
    exit 1
fi
echo "✅ Node.js found: $(node --version)"

# Start backend services
echo "🏗️  Starting backend services..."
cd neobank-api
docker-compose -f docker-compose.microservices.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check if services are running
if docker-compose -f docker-compose.microservices.yml ps --services --filter "status=running" | grep -q .; then
    echo "✅ Backend services started successfully!"
else
    echo "❌ Some backend services failed to start."
    docker-compose -f docker-compose.microservices.yml logs
    exit 1
fi

# Setup frontend
echo "🎨 Setting up frontend..."
cd ../neobank-frontend

if [ ! -d "node_modules" ]; then
    npm install
fi

# Start frontend
echo "🚀 Starting frontend..."
npm run dev &

echo "🎉 Setup complete!"
echo "📱 Frontend: http://localhost:5173"
echo "🔗 API Gateway: http://localhost:8080"
echo "📚 Check the README.md files for more information"