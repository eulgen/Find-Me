# Règles Globales du Projet FindMe

## Workflow d'Intégration API (Frontend Nuxt <-> Backend Spring Boot)

Chaque fois que vous travaillez sur la connexion entre le frontend et le backend, vous DEVEZ respecter ce processus :

1. **La référence absolue** est le contrat défini dans `findme.postman_collection.json`.
2. **Le backend** tourne sur `http://localhost:8080`. Ne jamais utiliser de mock server ou de fallback déconnecté.
3. **L'authentification** est strictement REST Stateless avec des jetons JWT en `localStorage` (pas de cookies).
4. **Protocole de Signalement et Validation (Obligatoire)** :
   - S'il y a un décalage, un endpoint manquant, ou un modèle de données différent, vous ne devez **JAMAIS** modifier le code de votre propre chef.
   - Vous devez d'abord arrêter et informer l'utilisateur avec ce format exact :
     - **Le soucis** : [explication de ce qui cloche]
     - **La solution proposée** : [comment vous comptez le résoudre]
   - Vous devez demander explicitement : "Voulez-vous Valider, Refuser, ou donner votre avis ?"
   - Attendez la réponse de l'utilisateur avant d'exécuter toute modification de code.
