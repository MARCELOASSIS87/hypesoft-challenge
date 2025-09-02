# ADR 0006 — Modelagem do Domínio

## Contexto
O desafio define requisitos de gestão de produtos, categorias e controle de estoque.  
Para refletir essas regras de negócio na camada de domínio, foi necessário modelar entidades básicas e seus relacionamentos.  
A modelagem do domínio deve permanecer independente da tecnologia de persistência (MongoDB), respeitando os princípios da Clean Architecture.

## Decisão
Foram criadas três entidades centrais em `ShopSense.Domain/Entities`:

- **Category**
  - Propriedades: Id, Name, Slug, Description?, IsActive, CreatedAt, UpdatedAt.
  - Usada para agrupar produtos.

- **Product**
  - Propriedades: Id, Name, Slug, Description?, Price, Sku?, Barcode?, CategoryId, Images[], StockQuantity, StockMin, Status, CreatedAt, UpdatedAt.
  - Associado a uma categoria.
  - Mantém controle básico de estoque no próprio documento.

- **InventoryMovement**
  - Propriedades: Id, ProductId, Type (in|out|adjustment), Quantity, Reason?, Ref?, OccurredAt, CreatedAt.
  - Permite registrar entradas, saídas e ajustes de estoque, garantindo rastreabilidade histórica.

### Regras adotadas
- Identificadores tratados como `string` no domínio (convertidos para `ObjectId` na infraestrutura).
- `CreatedAt` e `UpdatedAt` inicializados automaticamente.
- Separação entre **entidades de domínio** (simples POCOs) e **documentos de persistência** no Mongo (mapeados nos repositórios).
- Comentários XML em todas as propriedades para documentação inline (atendendo requisito do desafio).

## Consequências
**Prós**
- Modelo expressa claramente os conceitos centrais do sistema.
- Entidades simples, independentes da infraestrutura, facilitam testes e evolução.
- Base consistente para DTOs, validações e mapeamentos futuros.

**Contras**
- Requer código adicional de mapeamento entre domínio e persistência.
- Pode gerar duplicidade de propriedades entre entidades e documentos de banco.

## Status
Aceita — entidades implementadas e versionadas no domínio.
