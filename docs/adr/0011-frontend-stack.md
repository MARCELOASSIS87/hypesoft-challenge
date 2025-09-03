# ADR 0009 — Definição da Stack do Frontend

## Contexto
O projeto ShopSense exige um frontend moderno, rápido e responsivo, integrado ao backend .NET.  
O README do desafio orienta o uso de React + Vite + Tailwind, além de autenticação via Keycloak.

## Decisão
Foi definido o uso das seguintes tecnologias para o frontend:

- **React 18** com **Vite 7** e **TypeScript** como base do projeto.
- **TailwindCSS 3.4** para utilitários de estilo, com tema extendido (cores `brand` e sombras de card).
- **Shadcn/ui** como lib de componentes, junto com **lucide-react** para ícones.
- **React Router DOM 6** para roteamento SPA.
- **Axios** para consumo da API do backend.
- **React Hook Form + Zod** para formulários tipados e validação.
- **Keycloak-js** para autenticação OIDC.

A estrutura de pastas do frontend segue padrão:
src/
├── components/
├── pages/
├── hooks/
├── services/
├── lib/
└── utils/

markdown
Copiar código

## Consequências
- Alinhamento com o protótipo exigido (layout admin panel).
- Maior velocidade de build e hot reload com Vite.
- Tipagem e consistência reforçadas com TypeScript + Zod.
- Escalabilidade para CRUDs, autenticação e integração direta com o backend.