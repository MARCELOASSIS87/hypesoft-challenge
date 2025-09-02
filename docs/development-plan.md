# Plano de Desenvolvimento — Desafio Hypesoft (Prazo: 05/09)

## Metodologia
Adotado fluxo Scrum/Kanban simplificado, com entregas diárias incrementais.

## Cronograma

### Dia 1 – Backend: Domínio + API básica
- Criar entidades `Category` e `Product` em `ShopSense.Domain` - Ok
- Interfaces de repositórios (`ICategoryRepository`, `IProductRepository`) -Ok
- Implementar repositórios em `Infrastructure` (MongoDB Driver)
- Expor CRUD básico via `ShopSense.Api` (endpoints + Swagger)
- Commit + ADR sobre modelagem do domínio

### Dia 2 – Backend: Estoque + Qualidade
- Entidade `InventoryMovement`
- Endpoints de movimentação de estoque
- Endpoint “estoque baixo” (produtos com `stock.min` > `quantity`)
- Health checks (`/health`, `/ready`)
- Logging estruturado com Serilog
- **Testes unitários representativos** (xUnit + FluentAssertions):
  - Cobertura em regras críticas de negócio (CRUD, estoque baixo, movimentação)
  - Meta futura: expandir cobertura até **85%**, mas neste desafio manteremos foco em pontos essenciais

### Dia 3 – Frontend: UI + Integração
- Criar projeto React (Vite + Tailwind + Shadcn)
- Tela de Login com Keycloak (via OIDC)
- Tela de Produtos: listar, buscar, criar, editar, excluir
- Tela de Categorias: CRUD simples
- Commit + ADR sobre autenticação Keycloak

### Dia 4 – Extras + Finalização
- Dashboard: total de produtos, valor estoque, produtos com baixo estoque, gráfico por categoria
- Cache básico em queries (MemoryCache no backend)
- Ajustes de segurança (CORS, rate limiting, headers)
- Documentação final:
  - ADRs completas
  - README atualizado (execução, URLs, testes)
- Gravação de vídeo (5–10 minutos) demonstrando solução

## Observação sobre Testes
O requisito de cobertura mínima de **85%** é reconhecido como meta de qualidade.  
No prazo do desafio, será entregue **cobertura representativa** das regras críticas, documentando a estratégia de expansão futura para atingir a meta.
