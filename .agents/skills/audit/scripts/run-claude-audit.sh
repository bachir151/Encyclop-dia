#!/usr/bin/env bash
# Invocation lecture seule de Claude Code pour la Skill $audit.
set -euo pipefail

if ! command -v git >/dev/null 2>&1; then
  echo "Erreur : git est requis." >&2
  exit 127
fi
if ! command -v claude >/dev/null 2>&1; then
  echo "Erreur : commande claude introuvable (installer/configurer Claude Code)." >&2
  exit 127
fi

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

claude \
  --print \
  --permission-mode plan \
  --tools "Read,Glob,Grep,Agent" \
  --disallowedTools "mcp__*" \
  --output-format json \
  --max-turns 24 \
  --no-session-persistence \
  "Tu es un consultant EXCLUSIVEMENT EN LECTURE SEULE pour l'audit du dépôt Encyclopédia.
Lis AGENTS.md, CLAUDE.md, README.md, ainsi que les fichiers nécessaires.

Délègue, SI LA FONCTIONNALITÉ EST DISPONIBLE ET UTILE, à des subagents spécialisés :
1. architecture / maintenabilité ;
2. sûreté / tests / données ;
3. accessibilité et pédagogie interactive.
Demande-leur des analyses indépendantes, pas des modifications.

Aucun agent n'est autorisé à éditer, écrire, exécuter des commandes shell, modifier Git, publier, ni invoquer d'outils externes. Ne tente pas de contourner cette restriction.

Produis un rapport structuré en français :
- agents réellement utilisés (ou non, avec raison) ;
- constats triés par priorité ;
- chemins des fichiers et preuves concrètes ;
- risques et tests de reproduction possibles ;
- correctifs proposés, sans les exécuter ;
- incertitudes et points à trancher.

Codex seul examinera ce rapport, vérifiera les constats et réalisera d'éventuels changements."
