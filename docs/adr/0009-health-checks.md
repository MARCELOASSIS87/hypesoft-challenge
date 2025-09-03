# ADR 0009 — Health checks (liveness) e readiness

## Status
Aceito — 2025-09-03

## Contexto
Precisamos diferenciar verificação de **liveness** (processo vivo) e **readiness** (pronto para receber tráfego). O projeto já expõe endpoints REST e depende do **MongoDB**; portanto, a orquestração (Docker/Kubernetes) deve ter sinais claros para decidir iniciar/encaminhar tráfego.

## Decisão
- **/health (liveness):** endpoint mínimo que executa `ping` no Mongo via `IMongoDatabase.RunCommandAsync(new { ping = 1 })`.  
  - **200 OK** quando o processo está saudável e o Mongo responde.  
  - **500** quando a chamada falha (com `ProblemDetails`).
- **/ready (readiness):** endpoint que consulta o serviço `ISystemReadiness`, hoje implementado em `SystemReadiness` com `ping` no Mongo.  
  - **200** com payload `{ status: "ready", components: { mongo: "ok" } }` quando ok.  
  - **503** com `{ status: "degraded", components: { mongo: "error: ..." } }` quando qualquer dependência crítica falhar.
- `ISystemReadiness` fica na **ShopSense.Application**; `SystemReadiness` na **ShopSense.Infrastructure.Services**.
- O **composition root** permanece na **ShopSense.Api**, registrando as dependências e mapeando os endpoints.

## Consequências
- Facilita configuração de `livenessProbe` e `readinessProbe` em K8s/Compose.
- Payload de readiness é extensível (futuras dependências: cache, filas).
- Mantém separação de camadas e evita acoplamento de DI fora da API.

## Alternativas consideradas
- Usar apenas `/health` para ambos os propósitos — rejeitado (mistura responsabilidades).
- Health Checks nativos do ASP.NET (`Microsoft.Extensions.Diagnostics.HealthChecks`) — possível evolução, mas optamos por implementação leve e controlada, mantendo payload customizado.

## Referências técnicas
- `backend/src/ShopSense.Api/Endpoints/ReadinessEndpoints.cs`
- `backend/src/ShopSense.Infrastructure/Services/SystemReadiness.cs`
- `backend/src/ShopSense.Api/Program.cs` (mapeamento dos endpoints)