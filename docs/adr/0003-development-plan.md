# ADR 0003 — Plano de Desenvolvimento

## Contexto
O desafio possui prazo curto (até 05/09) e exige funcionalidades completas de gestão de produtos, categorias, estoque, dashboard e autenticação.  
Para garantir entregas incrementais e visibilidade, adotamos um plano de desenvolvimento baseado em Scrum/Kanban enxuto, com foco em ciclos diários.

## Decisão
- Elaborar um **plano de 4 dias**, documentado em `docs/development-plan.md`.
- Cada dia cobre um conjunto de entregas incrementais, com commits e ADRs associados.
- Escopo do plano:
  - **Dia 1:** Backend — entidades e CRUD básico (Category, Product).
  - **Dia 2:** Backend — estoque, health checks, logging, testes representativos.
  - **Dia 3:** Frontend — UI (React + Tailwind + Shadcn), integração com API e Keycloak.
  - **Dia 4:** Dashboard, cache, ajustes de segurança, documentação final e vídeo de apresentação.

## Consequências
**Prós**
- Permite organizar o trabalho em entregas incrementais dentro do prazo.
- Mostra alinhamento metodológico (Scrum/Kanban) e boas práticas de planejamento.
- Facilita comunicação de progresso e foco diário.

**Contras**
- Requer disciplina para cumprir os marcos diários.
- Escopo extra (ex.: cobertura de 85% em testes) será limitado e documentado como meta futura.

## Status
Aceita — plano criado e documentado em `docs/development-plan.md`.

