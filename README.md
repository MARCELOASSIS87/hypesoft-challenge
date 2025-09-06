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
# - API: http://localhost:5239
# - Swagger: http://localhost:5239/swagger

# --- Rodar Testes do Backend ---
/backend/tests/ShopSense.Tests$ dotnet test
# Cobre regras críticas de negócio: CRUD, estoque baixo e movimentação

# --- Rodar Frontend (React 18 + Vite + Tailwind + Shadcn) ---
/frontend$ npm install
/frontend$ npm run dev
# URL: http://localhost:5173
