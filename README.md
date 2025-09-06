# --- Subir infraestrutura (Mongo, Mongo Express, Keycloak) ---
/infra$ docker compose up -d
docker compose ps
# URLs:
# - Mongo Express: http://localhost:8081
# - Keycloak: http://localhost:8080

# --- Rodar API (Backend .NET 9) ---
/backend/src/ShopSense.Api$ dotnet restore
/backend/src/ShopSense.Api$ dotnet run
# URLs:
# - API: http://localhost:5000
# - Swagger: http://localhost:5000/swagger

# --- Rodar Testes do Backend ---
/backend/tests/ShopSense.Tests$ dotnet test
# Cobre regras críticas de negócio: CRUD, estoque baixo e movimentação

# --- Rodar Frontend (React 18 + Vite + Tailwind + Shadcn) ---
/frontend$ npm install
/frontend$ npm run dev
# URL: http://localhost:3000

## Demonstração em vídeo
[Assista à demonstração](docs/demo.mp4)

## Cobertura de Testes

Os testes cobrem desde configurações de infraestrutura (CORS, rate limiting, headers de segurança) até as regras de negócio críticas do estoque.

Veja a descrição detalhada dos cenários em [docs/tests-coverage.md](docs/tests-coverage.md).
