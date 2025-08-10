.PHONY: help build up down logs clean dev prod

# Variáveis
COMPOSE_FILE = docker-compose.yml
SERVICE_NAME = api

help: ## Mostra esta ajuda
	@echo "Comandos disponíveis:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Constrói as imagens Docker
	docker-compose -f $(COMPOSE_FILE) build

up: ## Inicia os serviços em produção
	docker-compose -f $(COMPOSE_FILE) up -d

down: ## Para e remove os serviços
	docker-compose -f $(COMPOSE_FILE) down

logs: ## Mostra os logs dos serviços
	docker-compose -f $(COMPOSE_FILE) logs -f

clean: ## Remove containers, imagens e volumes
	docker-compose -f $(COMPOSE_FILE) down -v --rmi all

dev: ## Inicia o ambiente de desenvolvimento
	docker-compose -f $(COMPOSE_FILE) --profile dev up -d

prod: ## Inicia apenas o ambiente de produção
	docker-compose -f $(COMPOSE_FILE) up -d api

restart: ## Reinicia os serviços
	docker-compose -f $(COMPOSE_FILE) restart

status: ## Mostra o status dos serviços
	docker-compose -f $(COMPOSE_FILE) ps

shell: ## Acessa o shell do container da API
	docker-compose -f $(COMPOSE_FILE) exec $(SERVICE_NAME) sh
