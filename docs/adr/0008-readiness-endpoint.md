# ADR 0008 — Readiness endpoint e estratégia de verificação

## Status
Aceito — 2025-09-03

## Contexto
O sistema já possui `/health` (ping simples). Precisamos de um endpoint de prontidão (`/ready`)
que valide dependências externas, começando pelo MongoDB, pois ele é crítico ao fluxo de estoque
e produtos.

## Decisão
- Criar interface `ISystemReadiness` na camada **ShopSense.Application** com um método `CheckAsync`.
- Implementar `SystemReadiness` na **ShopSense.Infrastructure**, utilizando `IMongoClient` e um `ping` no DB `admin`.
- Expor endpoint `GET /ready` em **ShopSense.Api**. Retornos:
  - `200 OK` com `status=ready` quando tudo ok.
  - `503 Service Unavailable` com `status=degraded` quando alguma dependência falhar.
- O payload traz um mapa `components` com o estado por dependência (inicialmente `mongo`).

## Consequências
- Observabilidade: torna-se claro quando a API está **pronta** para tráfego real.
- Implantação/K8s: facilita a configuração de `readinessProbe`.
- Extensível: novos componentes (ex.: filas, caches) podem ser adicionados ao `ISystemReadiness`
  sem alterar a camada de API além do payload.

## Alternativas consideradas
- Reutilizar `/health` para readiness (misturaria liveness com readiness).
- Usar health checks nativos (`Microsoft.Extensions.Diagnostics.HealthChecks`) — possível evolução,
  mas optamos por uma interface própria “thin” para desacoplar do pacote e manter controle de payload.
