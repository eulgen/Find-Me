# 🗺️ findMe Cameroun — Portail National d'Adressage Civique Standardisé

Bienvenue sur le projet **findMe Cameroun** !

**findMe** est un portail citoyen interactif permettant aux citoyens camerounais d'enregistrer, de gérer et de partager leur adresse domiciliaire conformément aux normes d'adressage municipal de la République du Cameroun. L'application propose un **Espace Citoyen complet** (dashboard), un **Panneau d'Administration**, un **Espace Support Agent** et une **Vitrine Publique** soignée, le tout conçu avec une charte graphique moderne, responsive et accessible.

---

## ⚡ Stack Technique

| Couche | Technologie | Version / Détails |
| --- | --- | --- |
| **Framework** | Nuxt | 4.5+ (avec Nitro 2.13 & Vite 8.2) |
| **UI** | Vue.js | 3.5+ (Composition API & `<script setup>`) |
| **Langage** | TypeScript | Typechecking strict (`tsconfig.json`) |
| **Styling** | Tailwind CSS (via `@tailwindcss/vite`) | 4.x (avec variables CSS custom & dark mode) |
| **Icons** | Lucide Vue Next | 1.x |
| **Cartographie** | Leaflet + Mapbox Geocoding API | Leaflet 1.9 |
| **Export & PDF** | jsPDF + Canvas | Génération de certificats A4 & Plaques SVG |
| **QR Code** | `qrcode` + `html5-qrcode` | Génération dynamique & Scan webcam en direct |
| **Images** | Format WebP optimisé | Performance élevée & temps de chargement ultra-rapide |
| **Authentification** | REST Stateless JWT / OAuth Google | Session locale via `localStorage` & JWT headers |
| **Contrat API** | Spring Boot | Spécification d'API dans `findme.postman_collection.json` |
| **Conteneurisation** | Docker & Docker Compose | Node server standalone (`Dockerfile`, `docker-compose.yml`) |

---

## 🎨 Fonctionnalités Principales

### 🏠 Vitrine Publique (Landing Page)

- **Hero Section** — Accueil interactif avec appel à l'action pour créer son adresse municipale.
- **Guide "Comment ça marche"** — Présentation visuelle et interactive du processus d'adressage.
- **Fonctionnalités clés** — Présentation des caractéristiques techniques (Précision GPS, Plaque officielle, Homologation Mairie, Gratuité).
- **Témoignages Citoyens** — Avis et retours d'expérience chargés dynamiquement depuis `app/data/reviews.json`.
- **FAQ Accordéon** — Réponses aux questions fréquentes basées sur `app/data/faq.json`.
- **Contact & Support Public** — Formulaire de contact intégré pour les demandes d'information.
- **Bouton Support WhatsApp (FAB)** — Widget de contact direct vers l'assistance civique.

### 🔐 Authentification & Inscription REST Stateless

- **Inscription & Connexion** (`/auth/signup`, `/auth/signin`) — Authentification REST stateless par jeton JWT stocké dans le `localStorage`.
- **OAuth Google Sign-In** — Authentification simplifiée avec Google Cloud Console (`nuxt-vue3-google-signin`).
- **Réinitialisation de mot de passe** (`/auth/reset-password`) — Flux de récupération sécurisé.
- **Middlewares de route** — Protection dynamique des pages via `auth.ts`, `admin.ts`, et `support.ts`.

### 📋 Espace Citoyen (`/users/me`)

- **Tableau de bord** (`/users/me`) — Résumé des adresses enregistrées, statut des plaques et accès rapide.
- **Gestionnaire d'adresses** (`/users/me/adresses`) — Consultation, filtrage, recherche et suppression des adresses.
- **Détail d'adresse** (`/users/me/adresses/[addressId]`) — Fiche d'adresse complète, visualisation cartographique et téléchargement de certificats.
- **Formulaire de création d'adresse** (`/users/me/adresses/create`) — Stepper multi-étapes interactif (Sélection ville/quartier, carte GPS Leaflet, capture photo de façade, validation identité).
- **Profil Utilisateur** (`/users/me/profil`) — Gestion des informations personnelles et mise à jour de photo.
- **Support & Ticket** (`/users/me/support`) — Création et suivi des demandes d'assistance.

### 🛡️ Panneau Administrateur (`/admin`)

- **Dashboard Admin** (`/admin`) — Vue d'ensemble avec métriques globales de la plateforme.
- **Gestion des Adresses** (`/admin/adresses`) — Validation et supervision municipale des plaques d'adressage.
- **Gestion des Utilisateurs** (`/admin/users`) — Liste des citoyens, attribution des rôles et contrôle d'accès.
- **Support Administrateur** (`/admin/support`) — Traitement et résolution des tickets de support.

### 🎧 Espace Agent Support (`/support-agent`)

- **Dashboard Agent** (`/support-agent`) — Console dédiée à la prise en charge rapide des requêtes citoyennes.
- **Traitement des Tickets** (`/support-agent/support`) — Gestion et réponses aux demandes de support.

### 📍 Géolocalisation, Cartographie & Export

- **Géolocalisation GPS & Carte Leaflet** — Positionnement précis au mètre près avec carte interactive.
- **Capture Photo de Façade** — Prise de photo par webcam ou téléversement avec moteur de compression image.
- **Certificat Officiel PDF & QR Code** — Export immédiat en PDF A4 avec QR Code scannable et plaque officielle SVG.
- **Scanner QR Code** — Lecteur QR intégré via `html5-qrcode` accessible directement depuis le header.

---

## 🛠️ Architecture du Projet

```text
Find-Me/
├── app/
│   ├── app.vue                          # Point d'entrée principal (NuxtLayout + NuxtPage)
│   ├── error.vue                        # Page d'erreur 404 / 500 sur mesure
│   │
│   ├── pages/
│   │   ├── index.vue                    # Vitrine publique (Landing page)
│   │   ├── creer-mon-adresse.vue        # Formulaire public de création d'adresse
│   │   ├── auth/
│   │   │   ├── signin/index.vue         # Page de connexion
│   │   │   ├── signup/index.vue         # Page d'inscription
│   │   │   ├── reset-password/index.vue # Réinitialisation du mot de passe
│   │   │   └── verify-account/index.vue # Validation de compte
│   │   ├── oauth2/
│   │   │   └── callback.vue             # Redirection OAuth2
│   │   ├── users/
│   │   │   └── me/                      # Espace Citoyen (Route protégée par auth.ts)
│   │   │       ├── index.vue            # Tableau de bord citoyen
│   │   │       ├── adresses/
│   │   │       │   ├── index.vue        # Liste et gestion des adresses
│   │   │       │   ├── [addressId].vue  # Fiche détaillée d'une adresse
│   │   │       │   └── create.vue       # Formulaire de création d'adresse
│   │   │       ├── profil/index.vue     # Profil citoyen
│   │   │       └── support/index.vue    # Espace d'aide et tickets
│   │   ├── admin/                       # Espace Administration (Protégé par admin.ts)
│   │   │   ├── index.vue                # Tableau de bord admin
│   │   │   ├── adresses/index.vue       # Supervision globale des adresses
│   │   │   ├── users/index.vue          # Gestion des comptes utilisateurs
│   │   │   ├── profile/index.vue        # Profil admin
│   │   │   └── support/index.vue        # Supervision des demandes support
│   │   └── support-agent/               # Espace Agent Support (Protégé par support.ts)
│   │       ├── index.vue                # Console agent support
│   │       ├── profile/index.vue        # Profil agent
│   │       └── support/index.vue        # Traitement des tickets
│   │
│   ├── layouts/
│   │   ├── default.vue                  # Layout public (Header, Footer, Modaux globaux)
│   │   ├── auth.vue                     # Layout épuré pour l'authentification
│   │   ├── dashboard.vue                # Layout Espace Citoyen avec Sidebar
│   │   ├── dashboard_admin.vue          # Layout Espace Administrateur avec Sidebar dédiée
│   │   └── dashboard_support.vue        # Layout Espace Support Agent
│   │
│   ├── middleware/
│   │   ├── auth.ts                      # Vérification de jeton JWT / session citoyenne
│   │   ├── admin.ts                     # Vérification du rôle Administrateur
│   │   └── support.ts                   # Vérification du rôle Support Agent
│   │
│   ├── components/
│   │   ├── ui/                          # Composants UI globaux et réutilisables
│   │   │   ├── Header.vue               # Navigation principale
│   │   │   ├── Footer.vue               # Pied de page officiel
│   │   │   ├── Hero.vue                 # Section Hero
│   │   │   ├── HowItWorks.vue           # Section "Comment ça marche"
│   │   │   ├── Features.vue             # Section fonctionnalités
│   │   │   ├── Testimonials.vue         # Section avis & témoignages
│   │   │   ├── Faq.vue                  # Accordéon FAQ
│   │   │   ├── Partners.vue             # Bandeau partenaires
│   │   │   ├── ContactSupport.vue       # Formulaire de contact
│   │   │   ├── ButtonUI.vue             # Composant bouton générique
│   │   │   ├── FindMeLogo.vue           # Logo SVG réactif
│   │   │   ├── GoogleButtonUI.vue       # Bouton Google Sign-In
│   │   │   ├── CreateAddressForm.vue    # Dialogue de création rapide d'adresse
│   │   │   ├── QRScanner.vue            # Scanner de QR Code interactif
│   │   │   ├── ForgotPassword.vue       # Module mot de passe oublié
│   │   │   ├── ToastNotifications.vue   # Système de toasts de notification
│   │   │   ├── SkeletonUI.vue           # Indicateur de chargement skeleton
│   │   │   ├── CtaBold.vue              # Call to Action
│   │   │   ├── ThemeToggle.vue          # Commutateur mode sombre / clair
│   │   │   └── WhatsAppSupportFab.vue   # Widget WhatsApp
│   │   │
│   │   ├── address-form/                # Composants du Stepper d'adressage
│   │   │   ├── AddressStepper.vue       # Conteneur principal multi-étapes
│   │   │   ├── FormCityFields.vue       # Sélection Région / Ville / Arrondissement
│   │   │   ├── FormLocationFields.vue   # Carte GPS et coordonnées
│   │   │   ├── FormPhotoCapture.vue     # Prise de vue photo de façade
│   │   │   └── FormUserInfoFields.vue   # Identification du demandeur
│   │   │
│   │   ├── dashboard/                   # Composants internes des tableaux de bord
│   │   │   ├── DashboardOverview.vue    # Vue d'ensemble citoyenne
│   │   │   ├── AddressManager.vue       # Liste et filtres des adresses
│   │   │   ├── AddressDetailsView.vue   # Composant d'affichage détaillé d'adresse
│   │   │   ├── UserProfile.vue          # Édition de profil
│   │   │   └── HelpSupport.vue          # Module d'aide
│   │   │
│   │   ├── illustrations/               # Composants vectoriels
│   │   │   └── CtaIllustration.vue      # Visuel d'illustration CTA
│   │   │
│   │   └── modals/                      # Dialogues modaux globaux
│   │       ├── AuthModal.vue            # Modal de connexion / inscription rapide
│   │       ├── AddressDetailsModal.vue  # Modal de prévisualisation d'adresse
│   │       ├── ShareModal.vue           # Modal de partage social
│   │       └── DeleteConfirmModal.vue   # Modal de confirmation de suppression
│   │
│   ├── composables/                     # Logique métier réactive (Composition API)
│   │   ├── useAuth.ts                   # Authentification, JWT, rôle et session
│   │   ├── useAddresses.ts              # Gestion des adresses et filtres
│   │   ├── useAddressExporter.ts        # Exportation PDF & génération SVG de plaque
│   │   ├── useAdminData.ts              # Métriques et gestion admin
│   │   ├── useCameraAndPhoto.ts         # Prise de vue webcam et compression JPEG
│   │   ├── useCitizenSpacePage.ts       # Logique globale de l'Espace Citoyen
│   │   ├── useContactSupport.ts         # Soumission des formulaires de contact
│   │   ├── useForgotPassword.ts         # Réinitialisation du mot de passe
│   │   ├── useMemory.ts                 # Synchronisation réactive `localStorage`
│   │   ├── useNavigation.ts             # Navigation et scroll d'ancres
│   │   ├── useShare.ts                  # Partage Web Share API, WhatsApp, Email
│   │   ├── useSupportForm.ts            # Gestion du support et tickets
│   │   ├── useTheme.ts                  # Basculement de thème clair/sombre
│   │   ├── useToasts.ts                 # Notification Toast réactive
│   │   ├── useUserProfile.ts            # Gestion et sauvegarde du profil
│   │   ├── useValidation.ts             # Directives de validation des données
│   │   └── address/
│   │       ├── useAddressFormState.ts   # État global du formulaire d'adresse
│   │       ├── useAddressMap.ts         # Intégration de la carte Leaflet
│   │       └── useAddressStepperLogic.ts# Contrôle des étapes du Stepper
│   │
│   ├── types/
│   │   └── types.ts                     # Interfaces & types TypeScript
│   │
│   ├── data/                            # Données statiques JSON
│   │   ├── faq.json                     # Questions & Réponses de la FAQ
│   │   └── reviews.json                 # Liste des avis citoyens
│   │
│   ├── plugins/
│   │   └── api.client.ts                # Intercepteur HTTP $fetch & gestion des headers JWT
│   │
│   └── assets/
│       └── css/
│           └── main.css                 # Style global Tailwind CSS v4
│
├── public/
│   ├── favicon.svg                      # Favicon officiel findMe
│   ├── robots.txt                       # Directives d'indexation SEO
│   └── assets/images/                   # Visuels WebP optimisés (gain de 77% sur le poids)
│
├── Dockerfile                           # Image Docker multi-stage pour le déploiement
├── docker-compose.yml                   # Configuration Docker Compose
├── findme.postman_collection.json       # Collection Postman (Spécification API Backend Spring Boot)
├── api-docs.json                        # Fichier de documentation OpenAPI / Swagger
├── nuxt.config.ts                       # Configuration du framework Nuxt
├── tsconfig.json                        # Configuration TypeScript
└── package.json                         # Scripts et dépendances Node.js
```

---

## 🚀 Démarrage Rapide

### Prérequis

- **Node.js** ≥ 18.x (Recommandé : Node 20 LTS)
- **npm** ≥ 9.x
- **Backend Spring Boot** s'exécutant sur `http://localhost:8080` (selon la collection `findme.postman_collection.json`)

### 1. Installation

```bash
# Cloner le dépôt
git clone <url-du-depot>
cd Find-Me

# Installer les dépendances Node
npm install
```

### 2. Variables d'Environnement

Créez un fichier `.env` à la racine du projet :

```env
# Configuration URL Publique
NUXT_PUBLIC_URL=http://localhost:3000

# Backend Spring Boot API
NUXT_PUBLIC_GEOLINK_FINDME=http://localhost:8080

# Token Mapbox (Optionnel pour Géocodage)
NUXT_PUBLIC_MAPBOX_TOKEN=pk.xxxxxxxxxxxxxxxxxxxxxxx

# Support WhatsApp
NUXT_PUBLIC_WHATSAPP_NUMBER=+237XXXXXXXXX

# Google OAuth Client ID
NUXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
```

### 3. Exécution en Développement

```bash
npm run dev
```

L'application est disponible sur `http://localhost:3000`.

---

## 🐳 Déploiement Docker

Le projet intègre une configuration Docker prête pour la production :

```bash
# Lancement avec Docker Compose
docker-compose up --build -d
```

L'application sera compilée sous forme de serveur Nitro Node.js et exposée sur le port `3000`.

---

## 📜 Directives d'Intégration API Backend

1. **Référence API** : Le contrat d'interfaçage est strictement défini dans `findme.postman_collection.json`.
2. **Hôte Backend** : Le serveur backend s'exécute sur `http://localhost:8080`.
3. **Authentification** : Utilisation exclusive du protocole REST Stateless avec des jetons JWT gérés en `localStorage`.
