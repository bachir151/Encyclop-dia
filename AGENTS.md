# Encyclopédia — instructions pour les agents IA

## Mission
Construire une encyclopédie personnelle, interactive et interdisciplinaire. Expliquer à partir des premiers principes, tester la compréhension, puis relier les idées de manière argumentée.

## Workflow obligatoire
1. Enseigner **dans la conversation** avant de publier : problème concret, nécessité du concept, hypothèses, reconstruction étape par étape, exemples et limites.
2. Montrer des schémas et des simulations lorsqu'ils améliorent la compréhension.
3. Poser un QCM avec réponses expliquées ; reprendre les erreurs avec l'utilisateur.
4. **Attendre sa validation explicite de compréhension et son autorisation de publier l'article.** Le seul score au QCM ne suffit pas.
5. Copier `modeles/article-template.html` vers le dossier thématique canonique `<domaine>/<sous-domaine>/<concept>/index.html` ; remplir les sections obligatoires et adapter `{{RACINE}}`. Réutiliser `moteur/lesson.js` pour animations et QCM, sans dupliquer cette logique dans chaque article.
6. Ajouter le concept à `donnees/concepts.json` et chaque lien justifié à `donnees/relations.json`. Les ID sont uniques, immuables et indépendants du chemin.
7. Vérifier liens, responsive, clavier, animations, fonctionnement sans mouvement réduit, QCM et cohérence du graphe.
8. Après vérification, committer et pousser sans force-push. Fournir URL et SHA.

## Exigences pédagogiques
- Ouvrir par « Quel problème cherchait-on à résoudre ? ».
- Déduire progressivement le mécanisme réel, sans jargon prématuré.
- Distinguer analogies, faits et simplifications.
- Illustrer les interactions par schémas exacts ; simulations en SVG, Canvas ou WebAssembly si justifiées.
- Prévoir QCM avec distracteurs plausibles, explications et résumé « À retenir ».
- Ajouter prérequis et liens vers les concepts connexes.
- Vérifier les faits susceptibles de changer.

## Architecture
- `index.html` : portail, recherche, graphe 3D, exploration libre et parcours guidé.
- `moteur/` : styles et JavaScript communs, y compris `lesson.js` pour les étapes d'animations et les QCM corrigés.
- `modeles/` : gabarit HTML First Principles et guide d'utilisation. Ce gabarit ne remplace pas la validation humaine du contenu.
- `donnees/concepts.json` : catalogue de concepts (id, titre, catégorie, URL, statut, prérequis, position).
- `donnees/relations.json` : liens typés et expliqués.
- `informatique/reseaux/arp/index.html` : article *de démonstration*, pas une validation de compréhension.
- Ajouter les dossiers thématiques au besoin, noms de chemins ASCII minuscules à tirets.
- Une idée appartient à un dossier canonique mais peut se relier à plusieurs domaines.

## Relations
Utiliser `prerequis`, `utilise`, `application`, `analogie`, `contraste`, `exemple`. Chaque relation a une explication vérifiable. Éviter les associations vagues faites pour densifier le graphe.

## Design
Style « Vintage Vert » : vert #1C322D, crème #F8F3EE, or #EBB552, rose #F1CDBE. Présentation aérée, contrastes, clavier, mobile et `prefers-reduced-motion`. Le graphe 3D doit avoir une alternative textuelle.

## Sécurité et Git
Dépôt GitHub privé, site Bash World public sur Cloudflare Pages : ne jamais inclure de données personnelles ni de secrets dans les articles ; ne pas changer la visibilité du dépôt. Pas de télémétrie ou de secrets. Respecter les modifications existantes. Aucun push forcé. Pages compatibles avec tout hébergement HTTP statique.
