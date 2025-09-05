# ADR 0017 — Cache básico de queries no backend (in-memory)

- Status: Aprovado
- Data: 2025-09-05

## Contexto
Conforme o development-plan (Dia 4), foi solicitado um cache simples em memória para reduzir latência/carga do banco em rotas de leitura.

## Decisão
Implementado **cache em memória** via `IMemoryCache` + middleware `QueryCacheMiddleware` aplicado somente a **GET**.  
Características:
- **Chave**: `METHOD + PATH + QUERYSTRING` (query ordenada) com hash SHA-256.
- **TTL** configurável por env (`CACHE_TTL_SECONDS`).
- **Toggle** via env (`CACHE_ENABLED`).
- **Escopo** de rotas via env (`CACHE_PATHS` coma-separado). Vazio = todas GET.
- **Armazena** apenas respostas **200** com `Content-Type` contendo `application/json`.
- **Logs** de acerto e falta: `[Cache HIT]` / `[Cache MISS]`.

## Implementação
- Arquivo: `ShopSense.Api/Middlewares/QueryCacheMiddleware.cs`
- Registro de serviços: `ShopSense.Api/Extensions/CacheSetupExtensions.cs`
- Pipeline (`Program.cs`):
  - `builder.Services.AddQueryMemoryCache();`
  - `app.UseMiddleware<ShopSense.Api.Middlewares.QueryCacheMiddleware>();`

## Configuração
Variáveis de ambiente (exemplos):
CACHE_ENABLED=true
CACHE_TTL_SECONDS=60
CACHE_PATHS=/products,/categories,/products/low-stock

## Critérios de aceite (validados)
- 1ª chamada GET → **MISS** logado.
- Chamadas subsequentes (dentro do TTL) → **HIT** logado.
- Expirado o TTL → volta a **MISS**.
- Middleware não interfere em métodos não-GET.

## Alternativas consideradas
- Redis/Memcached: descartado por exceder escopo do desafio.
- Sem cache: não atende ao requisito de performance do README.

## Consequências
- **Prós**: redução de latência/carga; implementação simples; controlável por env.
- **Contras**: risco de dado levemente defasado dentro do TTL; invalidação imediata após mutações não implementada no MVP.

## Próximos passos (opcional / extra)
- Invalidação pontual por recurso após POST/PUT/PATCH/DELETE.
- Métricas por rota (hits/misses) em contador/agregação.
