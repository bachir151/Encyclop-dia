# Encyclopédia

Une encyclopédie personnelle et interactive construite selon l'approche **First Principles** : partir d'un problème, reconstruire une explication, s'exercer, puis relier les connaissances.

## Première version
- Portail avec graphe **3D rotatif**, zoom, recherche, sélection et fiches de concepts.
- Modes **exploration libre** et **parcours guidé par prérequis**.
- Concepts et relations typées dans `donnees/*.json`.
- Article **de démonstration** sur ARP : animation pas à pas et QCM corrigé.
- Instructions d'ajout d'articles dans `AGENTS.md`.

## Tester en local

```bash
python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000`. Ouvrir directement le fichier via `file://` empêche souvent `fetch()` de lire le JSON.

## Ajouter un article
1. Expliquer le sujet en conversation (First Principles), illustrer et vérifier avec un QCM.
2. Attendre la **validation explicite de compréhension** de l'utilisateur.
3. Créer `<domaine>/<sous-domaine>/<concept>/index.html`.
4. Mettre à jour les concepts et relations justifiées dans `donnees/`.
5. Vérifier l'article et le graphe ; créer un commit puis pousser.

Lire [AGENTS.md](AGENTS.md) pour les règles complètes.

## Confidentialité
Le dépôt GitHub est privé. Il n'a pas été rendu public et cette première version n'est pas déployée sur un domaine public. Vérifier les conditions et la visibilité de l'hébergement avant publication.
