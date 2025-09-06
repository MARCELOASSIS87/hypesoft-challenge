# ADR 0013 — Autenticação OIDC com Keycloak e Autorização por Roles (Admin/Manager/User)

## Status
Accepted — 2025-09-03

## Contexto
O desafio exige autenticação via **Keycloak (OIDC)**, proteção de rotas no frontend e **autorização baseada em roles**.  
Além disso, há ponto extra por **roles avançadas** (Admin, Manager, User).  
O backend não deve gerenciar senhas, mas **validar tokens JWT** emitidos pelo IdP.  
Precisamos de SSO, PKCE, verificação de sessão e forma simples de aplicar *guards* por role.

## Decisão
- Usar `keycloak-js` no frontend.  
- Inicialização com `check-sso`, `pkceMethod: S256` e `silentCheckSsoRedirectUri`.  
- Armazenar estado de sessão e perfil via `AuthProvider` (Context API).  
- Extrair roles de `realm_access.roles` e `resource_access[clientId].roles`.  
- Expor helpers `hasRoles` para proteger rotas/páginas/menus.  
- Rotas protegidas com wrapper `ProtectedRoute` e verificação de `authenticated`.  
- Guardas de role com HOC `WithRoles`.  
- Backend (.NET) valida JWT emitido pelo Keycloak e aplica `[Authorize(Roles = "Admin,Manager")]`.  
- Prevenir múltiplas inicializações no dev (React StrictMode) com *singleton guard* no `initKeycloak()`.  

## Consequências
- Simplicidade de uso em componentes (hook `useAuth()`).  
- Facilidade para guards de roles por rota (ex.: `hasRoles(['Admin'])`).  
- Segurança delegada a um IdP (Keycloak) com suporte a SSO, PKCE, MFA opcional.  
- Backend desacoplado da gestão de senhas.  
- Nova dependência operacional (Keycloak).  
- Necessidade de configurar realms/clients/roles em cada ambiente.  

## Alternativas Consideradas
- JWT “caseiro” no backend: rejeitado (não atende SSO/PKCE, revogação, MFA).  
- Auth0/Cognito: válidas, mas fora do escopo do desafio e com custo/lock-in.  

## Configuração do Keycloak (Dev)
- Realm: `shopsense`  
- Roles (realm): `Admin`, `Manager`, `User`  
- Client: `frontend` (public)  
  - Standard Flow: ON  
  - PKCE: S256  
  - Redirect URIs: `http://localhost:3000/*`  
  - Web Origins: `*`  
- Usuário de teste: criar, setar senha e atribuir role (ex.: `Admin`).  

## Variáveis de Ambiente (Frontend)
```env
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=shopsense
VITE_KEYCLOAK_CLIENT_ID=frontend

## Integração no Frontend
- `public/silent-check-sso.html` para *silent SSO*.  
- `src/lib/keycloak.ts`: inicialização com PKCE + *singleton guard*.  
- `src/context/AuthProvider.tsx`: estado da sessão, refresh periódico, `onTokenExpired`, `onAuthLogout`.  
- `src/utils/roles.ts`: helpers de roles.  
- `src/routes/ProtectedRoute.tsx`: bloqueio de rotas privadas.  
- Guardas de role com HOC `WithRoles`.  

## Integração no Backend (.NET)
- **OIDC/JWT Bearer**  
  - Authority: `http://localhost:8080/realms/shopsense`  
  - Audience: `frontend` (ou outro clientId da API)  
- **Autorização**  
  - `[Authorize]` para endpoints privados  
  - `[Authorize(Roles = "Admin,Manager")]` onde necessário  
- **Boas práticas**  
  - Cache do discovery document do Keycloak  
  - Tolerância de clock skew (30s)  
  - Logar `sub` / `preferred_username` para auditoria  

## Plano de Migração/Produção
- Separar realms por ambiente (`shopsense-dev`, `-stg`, `-prod`).  
- HTTPS obrigatório no Keycloak e nas origens.  
- *Client Secrets* apenas para apps confidenciais (não SPA).  
- Export dos realms versionados como infra-as-code.  

## Critérios de Aceite
- Login/logout funcionais via Keycloak.  
- Rotas protegidas redirecionam para `/login` se não autenticado.  
- Guards negam/permitem acesso conforme roles.  
- Token atualizado automaticamente antes de expirar.  
- README explica como levantar Keycloak e configurar `.env`.  

## Referências
- OpenID Connect Core 1.0  
- Keycloak Docs — Securing Applications (JavaScript Adapter)  
- OAuth 2.1 (draft) — PKCE S256  
