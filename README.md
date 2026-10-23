# Encyclopédia

Une encyclopédie personnelle et interactive construite selon l'approche **First Principles** : partir d'un problème, reconstruire une explication, s'exercer, puis relier les connaissances.

## Version 0.3
- Portail avec graphe **3D rotatif**, zoom, recherche, sélection et fiches de concepts.
- Modes **exploration libre** et **parcours guidé par prérequis**.
- Concepts et relations typées dans `donnees/*.json`.
- Article **de démonstration** sur ARP : animation pas à pas et QCM corrigé.
- Instructions d'ajout d'articles dans `AGENTS.md`.
- **Modèle pédagogique réutilisable** dans `modeles/article-template.html` et composants de simulation/QCM dans `moteur/lesson.js`.
- L'article ARP utilise désormais ce moteur partagé (animation et QCM).
- Article publié sur **systemctl** : schéma pas à pas, simulation des services Linux et QCM corrigé.
- Article publié sur **les paquets, APT et Snap** : échanges avec les dépôts, pannes réseau, comparaison des systèmes, schéma pas à pas et QCM.
- Relations explicatives consultables et sélectionnables dans les fiches, les arêtes du graphe et une liste textuelle accessible.
- Prérequis pédagogiques distingués des liens conceptuels ; contrôle automatique de cohérence avec Node 22.

## Tester en local

```bash
python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000`. Ouvrir directement le fichier via `file://` empêche souvent `fetch()` de lire le JSON.

## Vérifier les données avant publication

```bash
node outils/verifier.mjs
```

Le script contrôle l'unicité des ID, les références, les cycles de prérequis, les types de relations et l'existence des pages. Il retourne un code d'échec si une incohérence est détectée.

## Ajouter un article
1. Expliquer le sujet en conversation (First Principles), illustrer et vérifier avec un QCM.
2. Attendre la **validation explicite de compréhension** de l'utilisateur.
3. Copier `modeles/article-template.html` vers `<domaine>/<sous-domaine>/<concept>/index.html`, remplacer les champs `{{...}}` et adapter `{{RACINE}}`. Voir `modeles/README.md`.
4. Mettre à jour les concepts et relations justifiées dans `donnees/`.
5. Exécuter `node outils/verifier.mjs`, vérifier l'article et le graphe, puis regrouper les changements en un commit cohérent avant publication.

Lire [AGENTS.md](AGENTS.md) pour les règles complètes.

## Confidentialité
Le dépôt GitHub reste **privé**. Les fichiers de contenu du site sont déployés **publiquement** sur Cloudflare Pages : [Bash World](https://bash-world.pages.dev/). Chaque push sur `main` déclenche normalement un nouveau déploiement via l'intégration Git.
