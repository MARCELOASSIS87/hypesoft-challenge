# ADR 0005 — Padrão de Versionamento e .gitignore

## Contexto
Durante o desenvolvimento em .NET, o build gera arquivos temporários (`bin/`, `obj/`, caches de NuGet, etc.).  
Esses artefatos não fazem parte do código-fonte e não devem ser versionados no Git.  
Sem um `.gitignore`, esses arquivos acabam aparecendo como mudanças e poluem o repositório.

## Decisão
- Adicionar um `.gitignore` na raiz do projeto baseado no template oficial para .NET.
- Garantir que pastas e arquivos de build sejam ignorados (`bin/`, `obj/`, `out/`, caches).
- Garantir que arquivos de configuração locais de IDE (`.vs/`, `.idea/`, `.vscode/`) também sejam ignorados.
- Manter versionados apenas:
  - Código-fonte (`src/`)
  - Documentação (`docs/`)
  - Arquivos de configuração relevantes (`docker-compose.yml`, `.env.example`, etc.)
- Remover do versionamento qualquer artefato de build já incluído anteriormente.

## Consequências
**Prós**
- Repositório limpo e focado no código.
- Evita conflitos desnecessários em arquivos gerados automaticamente.
- Segue boas práticas de projetos open-source e profissionais.

**Contras**
- Requer disciplina: não incluir manualmente arquivos ignorados.

## Status
Aceita — `.gitignore` criado e build artifacts removidos do controle de versão.

