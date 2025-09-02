# ADR 0004 — Repositórios na Camada de Domínio

## Contexto
O sistema precisa acessar dados de forma desacoplada da tecnologia de persistência.  
Como estamos usando **Clean Architecture + DDD**, as dependências externas (MongoDB) não devem “vazar” para o domínio.  
O domínio deve apenas conhecer **contratos** (interfaces), deixando as implementações concretas para a camada de Infraestrutura.

## Decisão
- Criar interfaces de repositório em `ShopSense.Domain/Repositories`:
  - `ICategoryRepository`
  - `IProductRepository`
  - `IInventoryMovementRepository`
- Cada interface define operações essenciais de CRUD e consultas específicas:
  - Categorias: buscar por Id/Slug, listar todas, adicionar, atualizar, excluir.
  - Produtos: buscar por Id/Slug, paginação, buscar por categoria, CRUD completo.
  - Movimentos de estoque: buscar por Id, listar por produto, adicionar movimento.
- As entidades (`Category`, `Product`, `InventoryMovement`) interagem apenas via essas interfaces.
- Implementações concretas (MongoDB) ficarão em `ShopSense.Infrastructure`.

## Consequências
**Prós**
- Domínio independente da tecnologia de persistência.
- Facilita testes (mocks/stubs dos repositórios).
- Alinha-se ao padrão da Clean Architecture.

**Contras**
- Mais código inicial (interfaces + implementações separadas).
- Necessário manter sincronização entre contrato (Domain) e implementação (Infra).

## Status
Aceita — Interfaces criadas no domínio, implementações serão feitas na camada de Infraestrutura.

