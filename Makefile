# Makefile for Moot Chat Application
# Make sure to use tabs instead of spaces for indentation

.PHONY: help install test run down clean build dev lint logs status restart exec exec-ollama ollama-models ollama-pull ollama-test

# Default target - show help
help:
	@echo "Moot Chat Application - Available Commands:"
	@echo ""
	@echo "  make help     - Show this help message"
	@echo "  make install  - Install all requirements to run the service"
	@echo "  make test     - Run tests"
	@echo "  make run      - Run the service and all related services in Docker"
	@echo "  make down     - Teardown of all running services"
	@echo "  make clean    - Teardown and removal of all containers"
	@echo ""
	@echo "Additional Development Commands:"
	@echo "  make dev      - Run development server locally"
	@echo "  make build    - Build the Docker image"
	@echo "  make lint     - Run linting and type checking"
	@echo "  make logs     - Show Docker Compose logs"
	@echo "  make status   - Show service status"
	@echo "  make restart  - Restart all services"
	@echo "  make exec     - Execute shell in running container"
	@echo ""
	@echo "Ollama LLM Commands:"
	@echo "  make exec-ollama     - Execute shell in ollama container"
	@echo "  make ollama-models   - List available ollama models"
	@echo "  make ollama-pull MODEL=name - Pull a specific ollama model"
	@echo "  make ollama-test     - Test ollama service with a simple query"
	@echo ""

# Install all requirements
install:
	@echo "🔧 Installing requirements for Moot Chat Application..."
	@echo ""
	@echo "Checking for required tools..."
	@command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Please install Node.js 18+ from https://nodejs.org/"; exit 1; }
	@command -v pnpm >/dev/null 2>&1 || { echo "❌ pnpm is required but not installed. Install with: npm install -g pnpm"; exit 1; }
	@command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed. Please install Docker from https://docker.com/"; exit 1; }
	@command -v docker-compose >/dev/null 2>&1 || command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1 || { echo "❌ Docker Compose is required but not installed. Please install Docker Compose"; exit 1; }
	@echo "✅ All required tools are installed"
	@echo ""
	@echo "Installing Node.js dependencies..."
	pnpm install --frozen-lockfile
	@echo "✅ Installation completed successfully!"

# Run tests
test:
	@echo "🧪 Running tests..."
	pnpm test

# Build Docker image
build:
	@echo "🏗️ Building Docker image..."
	docker build -t moot-app .

# Run development server locally
dev:
	@echo "🚀 Starting development server..."
	pnpm dev

# Run linting and type checking
lint:
	@echo "🔍 Running linting and type checking..."
	pnpm build

# Run the service in Docker
run: build
	@echo "🚀 Starting all services with Docker Compose..."
	docker-compose up -d
	@echo ""
	@echo "✅ Services are starting up!"
	@echo "🌐 Application will be available at: http://localhost:3000"
	@echo "🤖 Ollama LLM service will be available at: http://localhost:11434"
	@echo "💾 SQLite database will be persisted in Docker volume"
	@echo ""
	@echo "⏳ Note: Ollama service may take a few minutes to start on first run"
	@echo "⏳ You'll need to pull a model before it can respond. Use: make ollama-pull MODEL=llama3.2:1b"
	@echo ""
	@echo "To check status: docker-compose ps"
	@echo "To view logs: docker-compose logs -f"
	@echo "To stop services: make down"

# Stop all running services
down:
	@echo "🛑 Stopping all services..."
	docker-compose down
	@echo "✅ All services stopped"

# Clean up - stop and remove containers, networks, and images
clean:
	@echo "🧹 Cleaning up all Docker resources..."
	@echo "Stopping services..."
	-docker-compose down
	@echo "Removing containers..."
	-docker-compose rm -f
	@echo "Removing images..."
	-docker rmi moot-app 2>/dev/null || true
	@echo "Removing unused Docker resources..."
	-docker system prune -f
	@echo "✅ Cleanup completed"

# Show Docker Compose logs
logs:
	@echo "📋 Showing service logs..."
	docker-compose logs -f

# Show Docker Compose status
status:
	@echo "📊 Service Status:"
	docker-compose ps

# Restart services
restart: down run

# Run a one-off command in the app container
exec:
	docker-compose exec moot-app /bin/sh

# Execute shell in ollama container
exec-ollama:
	docker-compose exec ollama /bin/bash

# Check ollama models
ollama-models:
	@echo "📋 Available Ollama models:"
	docker-compose exec ollama ollama list

# Pull a specific ollama model
ollama-pull:
	@echo "📥 Pulling Ollama model: $(MODEL)"
	@if [ -z "$(MODEL)" ]; then echo "Usage: make ollama-pull MODEL=model-name"; exit 1; fi
	docker-compose exec ollama ollama pull $(MODEL)

# Test ollama service
ollama-test:
	@echo "🧪 Testing Ollama service..."
	curl -X POST http://localhost:11434/api/generate -d '{"model":"$(shell grep OLLAMA_MODEL .env | cut -d= -f2)","prompt":"Hello, how are you?","stream":false}' -H "Content-Type: application/json"

# Default target
.DEFAULT_GOAL := help