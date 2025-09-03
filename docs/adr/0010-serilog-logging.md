# ADR 0010 — Logging estruturado com Serilog

## Status
Aceito — 2025-09-03

## Contexto
Precisamos de logs **estruturados** (JSON) para observabilidade, correlação e agregadores (ELK/Seq/Loki). O console padrão não entrega metadados consistentes nem formato adequado para parsing.

## Decisão
- Adotar **Serilog** com os pacotes:
  - `Serilog.AspNetCore`
  - `Serilog.Sinks.Console`
  - `Serilog.Enrichers.Environment`
  - `Serilog.Enrichers.Process`
  - `Serilog.Enrichers.Thread`
  - `Serilog.Formatting.Compact` (saída JSON compacta)
- Inicialização via **bootstrap logger** e `builder.Host.UseSerilog(...)` no `Program.cs`, **sem appsettings** (config por código neste momento).
- Habilitar `app.UseSerilogRequestLogging()` para log de requisições HTTP.
- **Enrichers** adicionados: `MachineName`, `ProcessId`, `ThreadId`, além de **correlação** via `requestId` (provido pelo middleware `UseRequestId`) e `TraceIdentifier`.
- Manter todos os registros de DI e endpoints existentes (nenhuma mudança funcional).

## Consequências
- Logs em **JSON** prontos para coletores/observabilidade.
- Padronização dos campos (método, rota, status, latência, requestId).
- Facilidade para evoluir para novos sinks (Seq, Loki, arquivo) sem alterar código de domínio.

## Alternativas consideradas
- Logging default do ASP.NET Core — formato não-estruturado.
- Outras libs (NLog, log4net) — Serilog possui melhor ecossistema para .NET moderno e JSON.

## Próximos passos (futuro)
- Parametrizar níveis/outputs via `appsettings.json` por ambiente.
- Adicionar **correlationId** distribuído (se aplicável).
- Incluir sink externo (Seq/Loki) no Compose/infra.

## Referências técnicas
- `backend/src/ShopSense.Api/Program.cs` (configuração Serilog + request logging)
- Middleware `backend/src/ShopSense.Api/Middlewares/RequestIdMiddleware.cs`