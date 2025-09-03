# 0007 — Política de Estoque e Mapeamento Mongo (products.stock)

## Contexto
- O desafio usa MongoDB. O schema da coleção `products` valida um campo `stock` como **objeto** (não um número).
- No domínio, o `Product` tem `StockQuantity` e `StockMin` como inteiros simples.
- A API deve registrar movimentos de estoque e manter o saldo ≥ 0.
- Precisamos de regras claras para os tipos de movimento e de um mapeamento entre domínio ↔ persistência.

## Decisão
1) **Política de movimento de estoque** (implementada em `InventoryService.ApplyStockChange`):
   - `in`: `quantity > 0` ➜ soma.
   - `out`: `quantity > 0` ➜ subtrai; **bloquear** se o saldo final ficaria negativo.
   - `adjustment`: `quantity != 0` (pode ser negativo) ➜ soma/subtrai livremente; **bloquear** se o saldo final ficaria negativo.

   Códigos de retorno no endpoint `POST /inventory`:
   - `400 BadRequest` para payload inválido (campos obrigatórios ausentes, quantidade inválida conforme o tipo).
   - `404 NotFound` se o produto não existe.
   - `409 Conflict` se a operação deixaria o saldo final negativo.
   - `201 Created` com `movement` e `stockQuantity` atualizados em caso de sucesso.

2) **Mapeamento Mongo de `Product`**:
   - Persistimos `stock` como **objeto** `{ quantity, min }`.
   - No domínio, mantemos `StockQuantity` e `StockMin` (simples).
   - O repositório (`ProductRepository`) faz a conversão:
     - `ProductDocument.Stock` ⇄ `Product.StockQuantity`/`Product.StockMin`
     - Usamos `[property: BsonElement("stock")]` para mapear e `[BsonElement]` nos campos internos do objeto.

3) **Atomicidade** (fase 1):
   - Persistência de movimento e atualização do produto são feitas sequencialmente.
   - Caso a consistência forte seja necessária (concorrência alta), considerar sessão/transaction com Mongo na próxima iteração.

## Consequências
- O domínio fica explícito e coerente com as regras de negócio.
- O schema do Mongo é respeitado sem “vazar” para a API/Swagger.
- Podemos evoluir para transações ou eventos de integração se necessário.

## Status
Aceito (Dia 2).
