# ADR 0015 — Dashboard com agregação no cliente (Dia 4)

## Contexto
O plano do Dia 4 exige um dashboard com:
- total de produtos, valor do estoque, lista de baixo estoque, gráfico por categoria
- sem definição explícita de endpoints de analytics.

## Decisão
Implementar o Dashboard agregando dados **no cliente** a partir de `/products` e `/categories`.  
- Evita suposições de API não documentadas (regra “sem adivinhação”).
- Atende ao requisito mínimo do README e do development-plan.

## Consequências
- Simplicidade e entrega rápida.
- Cálculo no cliente pode ser menos eficiente com grandes volumes.

## Alternativas Futuras (Extras)
- Expor endpoint `/analytics/overview` no backend com cache (MemoryCache/Redis).
- Adicionar métricas adicionais e paginação da lista de baixo estoque.
