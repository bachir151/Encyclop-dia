# Encyclopédia — consignes Claude Code

> **Commencer par lire [AGENTS.md](AGENTS.md) en entier.** C'est la référence commune pour tous les agents IA ; ce fichier précise seulement la manière dont Claude Code doit intervenir. En cas de divergence, suivre les instructions explicites de l'utilisateur puis `AGENTS.md`, et signaler le conflit.

## Projet et périmètre

- Dépôt GitHub **privé** : `bachir151/Encyclop-dia`.
- Site **public** : https://bash-world.pages.dev/ (Cloudflare Pages, déploiement Git).
- Encyclopédie interdisciplinaire First Principles : expliquer, illustrer, expérimenter, vérifier avec un QCM, puis relier au graphe de connaissances 3D.
- Ne jamais modifier la visibilité du dépôt ni publier des secrets ou des données personnelles.

## Avant de coder

1. Lire `AGENTS.md`, `README.md`, `modeles/README.md` et les fichiers pertinents de l'existant.
2. Examiner `modeles/article-template.html`, `moteur/lesson.js` et `moteur/styles.css` avant d'ajouter un article.
3. Vérifier `git status` et respecter les modifications non committées de l'utilisateur ou d'autres agents.
4. **Ne jamais créer ou publier un nouvel article sans validation explicite de compréhension et autorisation de l'utilisateur.** Une demande d'explication seule n'autorise pas la publication.
5. Pour une modification importante d'architecture, proposer une solution et obtenir l'accord de l'utilisateur avant de l'appliquer.

## Pour chaque article autorisé

- Respecter le chemin thématique canonique, en minuscules ASCII et sans doublons : `<domaine>/<sous-domaine>/<concept>/index.html`.
- Commencer par le problème réel, reconstruire le mécanisme depuis ses principes, différencier faits, analogies et limites.
- Ajouter des schémas exacts, une animation ou une simulation **utile** si elle apporte quelque chose à la compréhension.
- Réutiliser le moteur commun `moteur/lesson.js` pour les étapes et le QCM explicatif ; ne pas copier ce moteur dans chaque page.
- Mettre à jour `donnees/concepts.json` et `donnees/relations.json` avec des identifiants stables et des liens justifiés. Ne pas densifier artificiellement le graphe.
- Préserver l'exploration libre et le parcours guidé.
- Respecter le style **Vintage Vert** défini dans `AGENTS.md` et `moteur/styles.css`.

## Bonnes pratiques de développement

- Favoriser HTML sémantique, CSS, JavaScript moderne, SVG ; ajouter Canvas/WebGL/WebAssembly seulement lorsque cela se justifie.
- Conserver un site statique portable, sans dépendances inutiles ni suivi des visiteurs.
- Soigner les petits écrans, l'accessibilité clavier, les libellés, les textes alternatifs et `prefers-reduced-motion`.
- Modifier le minimum nécessaire ; éviter les refontes sans demande explicite.
- Vérifier les faits techniques ou scientifiques sensibles à l'évolution.
- Tester les liens relatifs, les ressources, les interactions, le QCM, les données JSON et la cohérence du graphe.

## Git, collaboration et livraison

- Ne pas écraser le travail de ChatGPT, Codex, Claude Code ou de l'utilisateur ; examiner les changements distants avant de pousser.
- Ne pas utiliser `git push --force`, ni de commandes de remise à zéro destructives.
- Les commits et les pushs d'un nouvel article nécessitent une autorisation explicite ; ne pas déduire ce droit d'une simple question pédagogique.
- Quand une publication est autorisée, vérifier le commit distant et l'accessibilité de l'article sur Bash World.
- Dans le compte rendu, indiquer précisément : fichiers modifiés, tests effectués, éventuelles limites, URL de l'article et SHA du commit.

## Répartition des rôles

- **ChatGPT** accompagne l'apprentissage, propose un QCM, puis demande si l'utilisateur souhaite publier l'article.
- **Claude Code** peut implémenter, maintenir, tester et améliorer le code du projet dans le périmètre autorisé.
- **L'utilisateur décide** du contenu, des changements majeurs et de la publication.

Ne pas recopier les règles détaillées d'`AGENTS.md` ici : les deux fichiers doivent rester complémentaires.
