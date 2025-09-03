# ADR 0010 — Autenticação com Keycloak (OIDC) e Roles Avançadas

## Status
Accepted — 2025-09-03

## Contexto
O projeto exige autenticação via OIDC com Keycloak e suporte a autorização baseada em roles avançadas (Admin, Manager, User). Precisamos de SSO, PKCE e detecção de sessão, com integração simples no frontend (React 18 + Vite + TS) e escalável para proteger rotas.

## Decisão
- Usar `keycloak-js` no frontend.
- Inicialização com `check-sso`, `pkceMethod: S256` e `silentCheckSsoRedirectUri`.
- Armazenar estado de sessão e perfil via `AuthProvider` (Context API).
- Extrair roles de `realm_access.roles` e `resource_access[clientId].roles`.
- Expor helpers `hasRoles` para proteger rotas/páginas/menus.
- Rotas protegidas com wrapper `ProtectedRoute` e verificação de `authenticated`.
- Página de `Login` com React Hook Form + Zod e botão “Entrar com Keycloak”.

## Consequências
- Simplicidade de uso em componentes (hook `useAuth()`).
- Facilidade para guards de roles por rota (ex.: `hasRoles(['Admin'])`).
- Dependência explícita de um IdP (Keycloak) para o fluxo completo.
- Necessidade de configurar Realm, Client e Roles no Keycloak.

## Alternativas Consideradas
- JWT estático sem IdP: rejeitada (não atende SSO, revogação, PKCE).
- Auth0/Cognito: possíveis, porém fora do escopo do desafio e com custo.

## Implementação
- `public/silent-check-sso.html` para SSO silencioso.
- `src/lib/keycloak.ts` encapsula init.
- `src/context/AuthProvider.tsx` gerencia estado, token, roles e refresh.
- `src/utils/roles.ts` helpers de roles.
- `src/pages/Login.tsx` fluxo de login.
- `src/main.tsx` rotas com `ProtectedRoute`.
