# Modèle pédagogique réutilisable — Encyclopédia v0.2

Ce dossier contient **un gabarit de page** ; ce n'est pas un nouvel article publié ni un outil de génération automatique. Copier `article-template.html` vers `<domaine>/<sous-domaine>/<concept>/index.html` **après validation du sujet par l'utilisateur**, puis remplir chaque emplacement `{{...}}`.

## Ordre pédagogique imposé

1. **Problème :** situation concrète, question motivante, contraintes.
2. **Premiers principes :** faits de base, raisonnement logique, limites d'une analogie.
3. **Expérience :** un schéma animé dont les étapes peuvent être contrôlées manuellement.
4. **Transfert :** cas réel, limite et contre-exemple.
5. **QCM :** questions diagnostiques avec distracteurs plausibles et explications.
6. **Synthèse et connexions :** idées à retenir, prérequis, liens justifiés vers d'autres concepts.

## Réutilisation technique

- Styles : `moteur/styles.css`.
- Contrôles d'animation : `moteur/lesson.js`, sans dépendance externe.
- Sur le conteneur : `data-stepper`.
- Dans le conteneur : `[data-step-captions] li` (une légende par étape), `[data-step-caption]`, `[data-step-back]`, `[data-step-next]`, `[data-step-status]`.
- Sur chaque groupe SVG que l'on veut révéler : `data-step-panel data-step-min="1"`, éventuellement `data-step-max="2"`. Les étapes commencent à zéro. Les éléments sont masqués à l'initialisation lorsqu'ils ne correspondent pas à l'étape courante.
- Pour un QCM : `<form data-quiz>`, puis un `<fieldset data-answer="b" data-explanation="...">` par question. Chaque fieldset contient des radios portant le même `name`, différent de celui des autres questions, et un `value` pour chaque réponse. Prévoir `[data-quiz-result]` en zone `aria-live`.
- Les erreurs sont expliquées après soumission ; aucun score n'est envoyé à un serveur.
- Adapter `{{RACINE}}` : par exemple `../../../` pour `informatique/reseaux/arp/`. Les liens doivent fonctionner sous `bash-world.pages.dev` et en local avec un serveur HTTP.

## Checklist avant commit

- [ ] Accord explicite de l'utilisateur pour publier le sujet.
- [ ] L'article commence par une question fondamentale.
- [ ] Le mécanisme est techniquement exact, sources vérifiées si nécessaire.
- [ ] Les étapes du simulateur affichent bien les bons panneaux.
- [ ] Navigation souris et clavier ; respect de `prefers-reduced-motion`.
- [ ] Chaque QCM présente au moins trois choix, une seule bonne réponse et une explication.
- [ ] Tester les parcours et les chemins de fichiers.
- [ ] Actualiser `donnees/concepts.json` et `donnees/relations.json` avec des relations argumentées.
- [ ] Commit et push vers GitHub, puis vérification du déploiement Cloudflare.

L'article `informatique/reseaux/arp/index.html` constitue un exemple **de démonstration** utilisant les mêmes composants.
