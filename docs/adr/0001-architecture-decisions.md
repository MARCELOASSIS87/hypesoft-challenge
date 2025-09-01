# ADR 0001 — Decisões Arquiteturais Iniciais

## Contexto
Desafio de gestão de produtos com requisitos de backend em .NET 9, autenticação com Keycloak, banco MongoDB e execução via Docker/Compose. Precisamos de base sólida para evoluir rapidamente e manter qualidade.

## Decisão
- **Nome do sistema**: ShopSense.
- **Estilo arquitetural**: Clean Architecture + DDD, separando Domain, Application, Infrastructure e Api.
- **Plataforma backend**: .NET 9 (C#).
- **Persistência**: MongoDB (coleções para produtos e categorias).
- **Autenticação/Autorização**: Keycloak (OIDC).
- **Containerização**: Docker + Docker Compose (serviços: mongo, mongo-express, keycloak; Nginx depois).
- **Ambiente de dev**: WSL2 no Windows para melhor performance e menos atritos em volumes.
- **Controle de versão**: Git + Conventional Commits.

## Consequências
- **Prós**: separação clara de responsabilidades, testabilidade, escalabilidade horizontal simples, setup reproduzível.
- **Contras**: mais projetos/arquivos e boilerplate inicial; curva de aprendizado em CQRS/DDD se expandirmos.
- **Impacto**: define os alicerces de código, pipelines e documentação (ADRs contínuas).

## Status
Aceita — criada na fase inicial do projeto.

## Links
- docs/adr/ (demais ADRs serão adicionadas aqui)
