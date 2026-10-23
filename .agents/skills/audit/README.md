# Workflow $audit — Encyclopédia

Cette Skill est déclenchée depuis **Codex CLI**, au niveau du dépôt local :

- `$audit diagnostic` : test sans écriture, recommandé lors du premier lancement.
- `$audit` : consultation de Claude et de ses subagents, vérification par Codex, corrections justifiées, tests, commit et push autorisés par les règles du dépôt.
- `$audit accessibilité du graphe` : audit ciblé.

## Préconditions sur l'ordinateur

- Codex CLI et Claude Code installés et authentifiés.
- Node.js disponible pour `node outils/verifier.mjs`.
- Git configuré avec des droits suffisants pour ce dépôt.
- Arbre de travail propre avant un audit automatique.

## Répartition du travail

Claude et ses subagents **lisent** et rédigent un rapport. Codex est l'unique responsable de l'écriture, des tests, de l'intégration et de la publication. L'exécution de Claude se fait en mode plan avec outils limités : `Read,Glob,Grep,Agent`, sans outils MCP.

Ce projet utilise Cloudflare Pages sur `main`. Le workflow privilégie un commit de fusion cohérent pour éviter les déploiements intermédiaires.

## Vérifier l'installation

Dans la racine du dépôt :

```bash
git pull --ff-only origin main
claude --version
node outils/verifier.mjs
codex
```

Puis saisir `$audit diagnostic` dans Codex.

Les permissions et protections existantes restent applicables. Une demande `$audit` n'autorise jamais la publication d'un nouvel article pédagogique sans validation explicite.
