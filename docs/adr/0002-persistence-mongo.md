# ADR 0002 — Persistência em MongoDB

## Contexto
O desafio define MongoDB como banco principal. Precisamos registrar o porquê e o como: modelagem, padrões de relacionamento, validação e índices, além de implicações na API e na operação.

## Decisão
- **Banco**: MongoDB 7 (containers via Docker Compose).
- **Modelagem**:
  - `categories(_id, name, slug, description?, isActive, createdAt, updatedAt)`
  - `products(_id, name, slug, description?, price, sku?, barcode?, categoryId, images[], stock{quantity,min}, status, createdAt, updatedAt)`
  - `inventory_movements(_id, productId, type[in|out|adjustment], quantity>0, reason?, ref?, occurredAt, createdAt)`
- **Relacionamentos**: referência por `ObjectId` (`products.categoryId`, `inventory_movements.productId`), sem `FOREIGN KEY`. Em casos de leitura intensiva e estável, podemos considerar **embed** de campos denormalizados (ex.: `categoryName`) para performance.
- **Validação**: `validator.$jsonSchema` em cada coleção (tipos, required, mínimos).
- **Índices**:
  - `categories`: `name` (unique), `slug` (unique)
  - `products`: `slug` (unique), `categoryId`, `text(name, description)`
  - `inventory_movements`: `productId`, `occurredAt(-1)`
- **Monetários**: `price` como `Decimal128` (compatível com cálculos precisos).
- **Auth**: usuários e papéis **no Keycloak** (não criamos `users` no Mongo).
- **Migrações**: controladas por scripts versionados (ADRs + scripts de criação/alteração), não há migrations formais como em ORMs SQL.

## Consequências
**Prós**
- Esquema flexível para produto/estoque.
- Leitura rápida com índices adequados; possibilidade de embed controlado.
- Simplicidade para histórico de estoque com `inventory_movements`.

**Contras**
- Sem integridade referencial nativa; responsabilidade de consistência na camada de aplicação.
- Joins exigem agregações (`$lookup`) e podem custar mais sem índices.
- Necessidade de disciplina em versionamento de esquema/validações.

## Operação
- Backup por volume do Docker/`mongodump`.
- Observabilidade futura via métricas do container e logs.
- Seeds mínimos para desenvolvimento (1 categoria, 1 produto, 1 movimento) já aplicados.

## Status
Aceita — implementada e validada no ambiente de desenvolvimento.

