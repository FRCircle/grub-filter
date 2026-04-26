.PHONY: run docker-run docker-stop clean help

# Default target
help:
	@echo "Available commands:"
	@echo "  make run         - Start a local Python HTTP server on port 8000"
	@echo "  make docker-run  - Build and start the app using Docker Compose (port 8080)"
	@echo "  make docker-stop - Stop the Docker containers"
	@echo "  make clean       - Remove node_modules and package files"

# Run locally with Python
run:
	python3 -m http.server 8000

# Docker commands
docker-run:
	docker-compose up --build

docker-stop:
	docker-compose down

# Cleanup
clean:
	rm -rf node_modules package.json package-lock.json
