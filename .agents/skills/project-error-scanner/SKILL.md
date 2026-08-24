---
name: Project Error Scanner Workflow
description: Parcourt le projet à la recherche d'erreurs (compilation, linter, TypeScript) et propose des solutions interactives avec validation obligatoire avant toute modification.
---

# Project Error Scanner Workflow

Tu dois appliquer ce workflow lorsque l'utilisateur te demande de chercher, d'auditer ou de résoudre des erreurs globales dans le projet.

## Objectif
Analyser l'ensemble du projet pour détecter des erreurs (erreurs de syntaxe, TypeScript, linting, problèmes de dépendances, etc.) et les résoudre de manière sécurisée avec l'accord systématique de l'utilisateur.

## Étapes obligatoires du Workflow

1. **Recherche des Erreurs (Audit)**
   - Utilise les outils d'analyse statique du projet pour détecter les erreurs. Lance par exemple des commandes comme `npx nuxi typecheck`, `npm run lint` ou un build de test.
   - Analyse les résultats obtenus pour isoler les fichiers et les lignes posant problème.

2. **Protocole de Signalement et Validation (Obligatoire et BLOQUANT)**
   - Pour CHAQUE erreur trouvée (ou groupe d'erreurs concernant le même fichier), tu ne dois **JAMAIS** modifier le code de ton propre chef.
   - Tu dois informer l'utilisateur de l'erreur en utilisant ce format exact :
     - **Le soucis** : [Explication claire de l'erreur trouvée, fichier et ligne concernés]
     - **La solution proposée** : [Comment tu comptes modifier le code pour résoudre le problème]
   - Tu dois ensuite demander explicitement : "Voulez-vous Valider, Refuser, ou donner votre avis ?"
   - Attends impérativement la réponse de l'utilisateur avant d'exécuter la moindre modification de code.

3. **Exécution et Vérification**
   - Une fois l'accord de l'utilisateur obtenu, applique la correction.
   - Relance une vérification (ex: relancer la commande qui a échoué) pour confirmer que l'erreur est résolue avant de passer à l'erreur suivante.
