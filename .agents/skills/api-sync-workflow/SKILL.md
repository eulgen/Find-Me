---
name: API Sync Workflow
description: Déclenche un processus strict de vérification et d'intégration entre le frontend et l'API backend (via la collection Postman), avec validation interactive obligatoire avant toute modification.
---

# API Sync Workflow

Tu dois appliquer ce workflow chaque fois que tu es chargé de lier le front end Nuxt au backend Springboot, ou de vérifier leur connectivité.

## Contexte
Le contrat API de référence est toujours le fichier `findme.postman_collection.json`. 
Le backend Spring Boot tourne sur `http://localhost:8080`.
L'authentification doit toujours être REST Stateless, avec stockage des JWT (`accessToken` et `refreshToken`) dans le `localStorage` (pas de cookies).

## Étapes obligatoires du Workflow

1. **Vérification de la Connexion (Audit)**
   - Vérifie que le frontend et le backend sont correctement connectés en comparant les endpoints du frontend avec la référence absolue `findme.postman_collection.json`.

2. **Connexion & Implémentation**
   - S'ils ne sont pas connectés, tu dois faire ce qu'il faut pour connecter le frontend et le backend (écrire ou adapter le code Nuxt).

3. **Rapport en cas de soucis (BLOQUANT)**
   - En cas de soucis (endpoint manquant, différence de format, problème d'architecture), l'utilisateur DOIT être informé avant toute modification.
   - Tu dois lui présenter clairement :
     - **Quel est le soucis**
     - **Ce qui doit être implémenté (La solution proposée)**
   - Tu dois attendre que l'utilisateur donne son avis, valide ou refuse.

4. **Exécution**
   - Une fois l'avis ou la validation de l'utilisateur obtenu, applique les modifications nécessaires pour finaliser la connexion.
