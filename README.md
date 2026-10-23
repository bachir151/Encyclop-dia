# Encyclopédia

Une encyclopédie personnelle et interactive construite selon l'approche **First Principles** : partir d'un problème, reconstruire une explication, s'exercer, puis relier les connaissances.

## Version 0.2
- Portail avec graphe **3D rotatif**, zoom, recherche, sélection et fiches de concepts.
- Modes **exploration libre** et **parcours guidé par prérequis**.
- Concepts et relations typées dans `donnees/*.json`.
- Article **de démonstration** sur ARP : animation pas à pas et QCM corrigé.
- Instructions d'ajout d'articles dans `AGENTS.md`.
- **Modèle pédagogique réutilisable** dans `modeles/article-template.html` et composants de simulation/QCM dans `moteur/lesson.js`.
- L'article ARP utilise désormais ce moteur partagé (animation et QCM).

## Tester en local

```bash
python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000`. Ouvrir directement le fichier via `file://` empêche souvent `fetch()` de lire le JSON.

## Ajouter un article
1. Expliquer le sujet en conversation (First Principles), illustrer et vérifier avec un QCM.
2. Attendre la **validation explicite de compréhension** de l'utilisateur.
3. Copier `modeles/article-template.html` vers `<domaine>/<sous-domaine>/<concept>/index.html`, remplacer les champs `{{...}}` et adapter `{{RACINE}}`. Voir `modeles/README.md`.
4. Mettre à jour les concepts et relations justifiées dans `donnees/`.
5. Vérifier l'article et le graphe ; créer un commit puis pousser.

Lire [AGENTS.md](AGENTS.md) pour les règles complètes.

## Confidentialité
Le dépôt GitHub reste **privé**. Les fichiers de contenu du site sont déployés **publiquement** sur Cloudflare Pages : [Bash World](https://bash-world.pages.dev/). Chaque push sur `main` déclenche normalement un nouveau déploiement via l'intégration Git.
