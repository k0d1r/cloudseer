.PHONY: up down build test

up:
	docker-compose up -d

down:
	docker-compose down

build:
	docker-compose build

test:
	@echo "Running tests across all microservices..."
	cd services/api-gateway && go test ./...
	cd services/cost-engine && go test ./...
	cd services/data-collector && go test ./...
	cd services/digital-twin && go test ./...
	cd services/agent-core && go test ./...

clean:
	docker-compose down -v
