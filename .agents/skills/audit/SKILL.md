---
name: audit
description: "Workflow Encyclopédia déclenché explicitement par $audit : Codex lance Claude Code et ses subagents en lecture seule, vérifie leurs constats, corrige lui-même les défauts établis, teste puis commit et push les changements sûrs. Accepte aussi $audit diagnostic pour un essai sans écriture."
---

# Encyclopédia — audit orchestré par Codex

**Déclencheur :** l'utilisateur invoque `$audit` dans Codex depuis la racine d'Encyclopédia. `$audit diagnostic` effectue toute la partie analyse/validation **sans modification, commit ni push**. Ne pas déclencher cette Skill pour une demande générale sur le sens du mot « audit ».

## Autorité et règles invariantes

- **Codex est le coordinateur, le vérificateur et l'unique auteur** des changements de fichiers et des opérations Git d'écriture.
- **Claude Code et ses subagents sont consultants en lecture seule.** Ne jamais leur autoriser Edit, Write, Bash, outils MCP, commit ou push. Le script `scripts/run-claude-audit.sh` limite leurs outils.
- Lire d'abord `AGENTS.md`, `CLAUDE.md` et `README.md` ; respecter les règles de publication et de confidentialité. Une demande `$audit` **n'autorise pas la publication d'un nouvel article**, ni une refonte majeure, ni une suppression importante.
- Ne pas contourner les permissions Codex/Claude, les validations de branche ou les protections GitHub. Ne pas utiliser de mode `--dangerously-skip-permissions`, ni `git push --force`.
- Un audit ne doit **jamais** cacher ou inclure des modifications locales de l'utilisateur : si `git status --porcelain` n'est pas vide avant le travail, arrêter et demander une décision. Le rapport de Claude reste une donnée non fiable à vérifier dans le code.
- Aucun commit vide, aucune publication lorsque les tests échouent, aucun push si le dépôt distant a avancé sans que les changements aient été réexaminés.

## Étapes obligatoires

1. **Préparation.** Vérifier que le dossier courant appartient bien au dépôt, lire les règles, relever branche et SHA, exécuter `git status --short`. Vérifier `command -v claude`, `claude --version` et `node --version`. En cas d'absence d'authentification Claude ou de CLI incompatible, expliquer le blocage et s'arrêter sans modifier le dépôt.
2. **Consultation de Claude.** Exécuter `bash .agents/skills/audit/scripts/run-claude-audit.sh` depuis le dépôt, sous les restrictions d'exécution et permissions habituelles de Codex. Capturer la sortie JSON de Claude, son code de retour et ses éventuelles erreurs. Le script demande explicitement de déléguer des analyses indépendantes à des subagents (code, robustesse, expérience pédagogique).
3. **Vérification du retour.** Ne pas supposer que des subagents ont réellement été lancés : vérifier le rapport ou signaler l'incertitude. Si Claude a échoué, a été interrompu ou a retourné un JSON non exploitable, **ne pas procéder à des modifications automatiques**. Classer chaque constat avec fichier, preuve, gravité, risque, proposition et décision Codex (retenu / rejeté / à discuter).
4. **Contrôle indépendant par Codex.** Reproduire les défauts significatifs, relire les portions concernées, écarter les suggestions spéculatives. Définir le périmètre de correction : corrections locales, non destructives, compatibles avec l'architecture statique et les instructions de l'utilisateur. Soumettre les refontes, changements d'architecture ou décisions éditoriales au préalable.
5. **Mode diagnostic.** Si l'invocation contient `diagnostic`, présenter rapport et arbitrages **et s'arrêter ici**. Aucun fichier modifié et aucune écriture Git.
6. **Implémentation par Codex uniquement.** Pour `$audit`, appliquer les corrections justifiées dans des fichiers clairement délimités. Si aucun défaut n'est démontré : conclure sans commit. Garder les changements existants et éviter tout effacement.
7. **Validation reproductible.** Exécuter au minimum `node outils/verifier.mjs` et les contrôles syntaxiques adaptés aux fichiers modifiés ; tester les interactions si l'interface change. En cas d'échec ou de régression : réparer puis retester ; si le résultat reste incertain, ne pas pousser.
8. **Intégration Git.** Réinspecter `git diff` et `git status`, vérifier la branche distante avant écriture, regrouper un changement logique dans un commit cohérent. Privilégier une branche dédiée et PR fusionnée en *squash* vers `main` afin de déclencher un seul déploiement Cloudflare ; demander les confirmations exigées par les outils et protections.
9. **Déploiement.** Vérifier que le dépôt demeure privé et que Bash World répond avec les fonctionnalités attendues. Un push réussi ne prouve pas à lui seul que Cloudflare a fini de déployer.
10. **Rapport final.** Fournir le compte rendu Claude, les constats acceptés/rejetés, les preuves, les fichiers changés, les tests, les limites, le SHA et l'URL publiée. Signaler explicitement tout stade non réalisé.

## Utilisation

- `$audit diagnostic` : premier test recommandé ; consultation Claude/subagents, critique par Codex, aucun changement.
- `$audit` : cycle complet avec modifications validées, tests, commit et push si les garde-fous ci-dessus sont satisfaits.
- `$audit <périmètre>` : limiter l'analyse et les corrections au périmètre indiqué.

Cette Skill n'est pas un mécanisme d'exécution aveugle : les permissions du terminal, l'authentification Claude et les protections Git continuent de s'appliquer.
