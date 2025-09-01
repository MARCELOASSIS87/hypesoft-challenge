#!/bin/bash

echo "=== Commit Interativo (Conventional Commits) ==="

# Tipos permitidos
TYPES=("feat" "fix" "docs" "style" "refactor" "test" "chore" "perf" "build")

echo "Escolha o tipo de commit:"
select TYPE in "${TYPES[@]}"; do
  if [[ -n "$TYPE" ]]; then break; fi
done

read -p "Informe o escopo (ex: api, infra, products): " SCOPE
read -p "Mensagem curta do commit: " MESSAGE

FULL_MESSAGE="$TYPE($SCOPE): $MESSAGE"

echo -e "\n📦 Commit final: $FULL_MESSAGE"
read -p "Confirmar? (y/n) " CONFIRM

if [[ "$CONFIRM" == "y" ]]; then
  git add .
  git status
  git commit -m "$FULL_MESSAGE"
  git push origin main
else
  echo "❌ Commit cancelado."
fi
