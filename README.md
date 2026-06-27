# 🗺️ findMe Cameroun — Portail National d'Adressage Civique Standardisé

Bienvenue sur le projet **findMe Cameroun** !

**findMe** est un portail citoyen interactif permettant aux citoyens camerounais d'enregistrer, de gérer et de partager leur adresse domiciliaire conformément aux normes d'adressage municipal de la République du Cameroun. L'application propose un **espace citoyen complet** (dashboard), un **panneau d'administration** et une **vitrine publique** soignée, le tout conçu avec une charte graphique moderne, responsive et accessible.

---

## ⚡ Stack Technique

| Couche | Technologie | Version |
| --- | --- | --- |
| **Framework** | Nuxt | 4.x |
| **UI** | Vue.js | 3.5+ |
| **Langage** | TypeScript | strict |
| **Styling** | Tailwind CSS (via `@tailwindcss/vite`) | 4.3+ |
| **Animations** | Motion (Framer Motion pour Vue) | 12.x |
| **Cartographie** | Leaflet + Mapbox Geocoding API | 1.9 |
| **Icônes** | Lucide Vue Next | 1.x |
| **Images** | `@nuxt/image` (`<NuxtImg>`) | 2.x |
| **PDF** | jsPDF | 4.x |
| **QR Code** | `qrcode` (génération) + `html5-qrcode` (scan) | 1.5+ / 2.3+ |
| **Auth OAuth** | Google Sign-In (`nuxt-vue3-google-signin`) | — |
| **IA** | Google GenAI SDK (`@google/genai`) | 2.4+ |

---

## 🎨 Fonctionnalités

### 🏠 Vitrine Publique (Landing Page)

- **Hero** — Section d'accueil animée avec appel à l'action pour créer son adresse
- **Partenaires** — Bandeau de crédibilité avec logos des partenaires institutionnels
- **Comment ça marche** — Guide pas-à-pas interactif (wizard) illustrant le processus de création d'adresse
- **Fonctionnalités clés** — Présentation des caractéristiques techniques de la plateforme (données chargées depuis `data/features.json`)
- **Témoignages** — Avis citoyens avec avatars et retours d'expérience (données depuis `data/reviews.json`)
- **FAQ** — Accordéon de questions fréquentes sur l'adressage municipal
- **Contact & Support** — Formulaire de contact public intégré à la landing page
- **Bouton WhatsApp flottant** — Accès direct au support client via WhatsApp (FAB persistant)

### 🔐 Authentification

- **Inscription** (`/auth/signup`) — Création de compte avec email, nom d'utilisateur et mot de passe
- **Connexion** (`/auth/signin`) — Authentification classique par email/mot de passe
- **OAuth Google** — Connexion en un clic via Google Sign-In
- **OAuth iCloud** — Connexion via compte iCloud
- **Mot de passe oublié** — Flux de réinitialisation en 2 étapes (envoi du lien → nouveau mot de passe)
- **Session persistante** — Cookie `findme_session` avec durée de vie de 7 jours
- **Middleware de protection** — Routes protégées via middlewares `auth` et `admin`

### 📋 Espace Citoyen (Dashboard Utilisateur)

- **Tableau de bord** (`/users/[id]`) — Vue d'ensemble avec statistiques et résumé des adresses
- **Gestion des adresses** (`/users/[id]/adresses`) — Liste CRUD complète des adresses enregistrées
- **Détail d'adresse** (`/users/[id]/adresses/[addressId]`) — Fiche détaillée d'une adresse spécifique
- **Création d'adresse** (`/users/[id]/adresses/create`) — Formulaire multi-étapes (stepper) pour enregistrer une nouvelle adresse
- **Profil utilisateur** (`/users/[id]/profil`) — Modification du nom, téléphone et photo de profil avec compression d'image
- **Aide & Support** (`/users/[id]/support`) — Formulaire de support avec catégorisation des demandes et suivi de tickets
- **Sidebar responsive** — Navigation latérale fixe sur desktop, drawer mobile avec overlay

### 🛡️ Panneau Administrateur

- **Dashboard admin** (`/admin`) — Tableau de bord administrateur avec métriques globales
- **Gestion des utilisateurs** (`/admin/users`) — Listing, recherche et gestion de tous les comptes citoyens
- **Gestion des adresses** (`/admin/adresses`) — Supervision et administration de toutes les adresses enregistrées
- **Support** (`/admin/support`) — Consultation et traitement des tickets de support soumis
- **Layout dédié** — Sidebar admin séparée avec layout `dashboard_admin`
- **Middleware admin** — Accès restreint aux utilisateurs ayant le rôle `admin`

### 📍 Géolocalisation & Cartographie

- **GPS haute précision** — Utilisation de `navigator.geolocation` avec `enableHighAccuracy: true` pour une localisation optimale
- **Géocodage inversé Mapbox** — Résolution automatique des coordonnées GPS en adresse structurée (région, département, ville, quartier)
- **Carte interactive Leaflet** — Visualisation des adresses enregistrées sur une carte interactive avec marqueurs
- **Pré-remplissage automatique** — Les champs ville/quartier se remplissent automatiquement après détection GPS

### 📷 Capture Photo & Compression

- **Capture webcam** — Accès à la caméra de l'appareil via `navigator.mediaDevices.getUserMedia` pour photographier la façade du domicile
- **Téléversement de fichier** — Upload alternatif d'une photo de façade depuis la galerie
- **Moteur de compression JPEG** — Compression automatique côté client avec affichage en temps réel du taux de réduction (ex: `-84%`)

### 📄 Export & Certificats

- **Plaque SVG vectorielle** — Génération dynamique d'une plaque d'adressage normée au format SVG, prête pour l'impression industrielle
- **Certificat PDF officiel** — Export au format PDF A4 via `jsPDF`, incluant un QR Code unique généré côté client
- **QR Code embarqué** — Chaque certificat contient un QR Code encodant le code d'adresse unique findMe

### 📱 Scanner QR Code

- **Scan en temps réel** — Scanner QR intégré via `html5-qrcode` permettant de scanner un code findMe avec la caméra
- **Dialogue dédié** — Interface modale de scan accessible depuis le header

### 🔗 Partage d'Adresses

- **API de partage native** — Utilisation de `navigator.share()` sur les appareils compatibles
- **Partage WhatsApp** — Lien formaté avec message personnalisé et code d'adresse
- **Partage Email** — Lien `mailto:` avec sujet et corps pré-rédigés
- **Copie du lien** — Copie dans le presse-papier avec notification de confirmation
- **Modal de fallback** — Boîte de dialogue de partage pour les navigateurs sans API Share native

### 🌙 Thème & Internationalisation

- **Mode sombre "Cyber-Dark"** — Basculement clair/sombre avec persistance du choix
- **Bilinguisme** — Support Français / Anglais (extensible)

### 🔔 Système de Notifications

- **Toasts dynamiques** — Notifications évasives de type toast (succès, erreur, info) centralisées via le composable `useToasts`

### 💾 Persistance Locale

- **Composable `useMemory`** — Abstraction générique pour la synchronisation automatique avec `localStorage`, avec auto-sauvegarde (watch profond), chargement, filtrage et réinitialisation
- **Données persistées** — Adresses, utilisateurs, tickets de support

### 🧩 Playground Interactif

- **Démonstration pas-à-pas** — Playground avec progression visuelle (stepper) pour simuler la création d'adresse, la visualisation sur carte et l'export de certificat

### 🔧 Validation Métier

- **Numéro d'habitation** — Validation par regex des formats municipaux camerounais (M-28B, Villa 4, Bloc 3, etc.)
- **Code postal** — Validation du code national `00237`, format Boîte Postale (BP), et codes à 5 chiffres
- **Retour utilisateur** — Messages et conseils contextuels en français pour chaque champ

---

## 🛠️ Architecture du Projet

```text
my-find-me/
├── app/
│   ├── app.vue                          # Point d'entrée (NuxtLayout + NuxtPage)
│   ├── error.vue                        # Page d'erreur personnalisée
│   │
│   ├── pages/
│   │   ├── index.vue                    # Landing page publique
│   │   ├── auth/
│   │   │   ├── signin/index.vue         # Page de connexion
│   │   │   └── signup/index.vue         # Page d'inscription
│   │   ├── users/
│   │   │   └── [id]/
│   │   │       ├── index.vue            # Dashboard citoyen
│   │   │       ├── adresses/
│   │   │       │   ├── index.vue        # Liste des adresses
│   │   │       │   ├── [addressId].vue  # Détail d'une adresse
│   │   │       │   └── create/index.vue # Création d'adresse
│   │   │       ├── profil/index.vue     # Profil utilisateur
│   │   │       └── support/index.vue    # Aide & support
│   │   └── admin/
│   │       ├── index.vue                # Dashboard administrateur
│   │       ├── adresses/index.vue       # Gestion admin des adresses
│   │       ├── users/index.vue          # Gestion admin des utilisateurs
│   │       └── support/index.vue        # Gestion admin du support
│   │
│   ├── layouts/
│   │   ├── default.vue                  # Layout public (Header + Footer + Modaux)
│   │   ├── dashboard.vue                # Layout Espace Citoyen (Sidebar + Slot)
│   │   └── dashboard_admin.vue          # Layout Espace Admin (Sidebar admin)
│   │
│   ├── components/
│   │   ├── ui/                          # Composants UI réutilisables
│   │   │   ├── Header.vue               # Barre de navigation principale
│   │   │   ├── Footer.vue               # Pied de page
│   │   │   ├── Hero.vue                 # Section héroïque d'accueil
│   │   │   ├── HowItWorks.vue           # Guide pas-à-pas
│   │   │   ├── Features.vue             # Caractéristiques techniques
│   │   │   ├── Testimonials.vue         # Témoignages citoyens
│   │   │   ├── Faq.vue                  # Questions fréquentes
│   │   │   ├── Partners.vue             # Section partenaires
│   │   │   ├── ContactSupport.vue       # Formulaire de contact public
│   │   │   ├── ButtonUI.vue             # Bouton réutilisable multi-variantes
│   │   │   ├── FindMeLogo.vue           # Logo SVG findMe
│   │   │   ├── GoogleButtonUI.vue       # Bouton de connexion Google
│   │   │   ├── ICloudButtonUI.vue       # Bouton de connexion iCloud
│   │   │   ├── CreateAddressForm.vue    # Formulaire global de création d'adresse
│   │   │   ├── QRScanner.vue            # Scanner QR Code interactif
│   │   │   ├── ForgotPassword.vue       # Formulaire de réinitialisation mdp
│   │   │   ├── ToastNotifications.vue   # Système de notifications toast
│   │   │   └── WhatsAppSupportFab.vue   # Bouton flottant WhatsApp
│   │   │
│   │   ├── address-form/                # Composants du formulaire d'adresse (stepper)
│   │   │   ├── AddressStepper.vue       # Stepper multi-étapes principal
│   │   │   ├── FormCityFields.vue       # Champs ville/arrondissement
│   │   │   ├── FormLocationFields.vue   # Champs de localisation GPS
│   │   │   ├── FormPhotoCapture.vue     # Module de capture photo
│   │   │   └── FormUserInfoFields.vue   # Champs identité utilisateur
│   │   │
│   │   ├── dashboard/                   # Composants de l'espace citoyen
│   │   │   ├── DashboardOverview.vue    # Vue d'ensemble du tableau de bord
│   │   │   ├── AddressManager.vue       # Gestionnaire d'adresses (CRUD)
│   │   │   ├── AddressDetailsView.vue   # Fiche détaillée d'une adresse
│   │   │   ├── UserProfile.vue          # Composant de profil utilisateur
│   │   │   └── HelpSupport.vue          # Composant aide & support
│   │   │
│   │   ├── modals/                      # Dialogues et modaux globaux
│   │   │   ├── AuthModal.vue            # Modal d'authentification
│   │   │   ├── AddressDetailsModal.vue  # Modal de détail d'adresse
│   │   │   ├── ShareModal.vue           # Modal de partage social
│   │   │   ├── DeleteConfirmModal.vue   # Modal de confirmation de suppression
│   │   │   └── PageLoader.vue           # Écran de chargement animé
│   │   │
│   │   └── playground/                  # Composants de démonstration
│   │       ├── PlaygroundProgress.vue   # Barre de progression du playground
│   │       ├── PlaygroundStepForm.vue   # Étape formulaire
│   │       ├── PlaygroundStepMap.vue    # Étape carte
│   │       └── PlaygroundStepCertificate.vue # Étape certificat
│   │
│   ├── composables/                     # Logique métier réactive (Composition API)
│   │   ├── useAuth.ts                   # Auth REST, OAuth Google/iCloud, session cookie
│   │   ├── useAddresses.ts              # CRUD réactif des adresses citoyennes
│   │   ├── useAddressExporter.ts        # Export SVG (plaque) et PDF (certificat + QR)
│   │   ├── useApi.ts                    # Accesseur du client HTTP global ($api)
│   │   ├── useCameraAndPhoto.ts         # Accès webcam et compression d'images
│   │   ├── useCitizenSpacePage.ts       # Logique du formulaire citoyen (géoloc, brouillon, CRUD)
│   │   ├── useContactSupport.ts         # Formulaire de contact et tickets support
│   │   ├── useForgotPassword.ts         # Réinitialisation de mot de passe (2 étapes)
│   │   ├── useGeoLocation.ts            # GPS haute précision + géocodage inversé Mapbox
│   │   ├── useMemory.ts                 # Abstraction localStorage réactive et persistante
│   │   ├── useNavigation.ts             # Navigation entre vues et scroll programmatique
│   │   ├── useShare.ts                  # Partage natif, WhatsApp, Email, presse-papier
│   │   ├── useSupportForm.ts            # Formulaire de support (validation, soumission)
│   │   ├── useTheme.ts                  # Dark mode / thème clair
│   │   ├── useToasts.ts                 # Notifications toast centralisées
│   │   ├── useUserProfile.ts            # Mise à jour du profil et photo
│   │   ├── useValidation.ts             # Validation des codes postaux et plaques
│   │   └── address/
│   │       ├── useAddressFormState.ts   # État réactif du formulaire d'adresse
│   │       └── useAddressMap.ts         # Logique de la carte Leaflet pour les adresses
│   │
│   ├── types/
│   │   └── types.ts                     # Interfaces TypeScript (AddressData, User, etc.)
│   │
│   ├── data/                            # Données statiques JSON
│   │   ├── features.json                # Fonctionnalités de la plateforme
│   │   ├── reviews.json                 # Témoignages citoyens
│   │   └── steps.json                   # Étapes du guide "Comment ça marche"
│   │
│   ├── layouts/                         # (cf. section layouts ci-dessus)
│   ├── middleware/
│   │   ├── auth.ts                      # Middleware : redirige vers /auth/signin si non connecté
│   │   └── admin.ts                     # Middleware : restreint l'accès au rôle admin
│   │
│   ├── plugins/
│   │   └── api.client.ts                # Plugin client : instance $fetch globale avec intercepteurs
│   │
│   └── assets/
│       └── css/
│           └── main.css                 # Feuille de styles globale (Tailwind + custom)
│
├── public/
│   ├── favicon.ico                      # Icône du site
│   ├── robots.txt                       # Directives pour les moteurs de recherche
│   └── assets/                          # Ressources statiques (images, etc.)
│
├── nuxt.config.ts                       # Configuration Nuxt (modules, runtime, Google Sign-In, Nitro)
├── tsconfig.json                        # Configuration TypeScript (références .nuxt)
├── package.json                         # Dépendances et scripts npm
├── .env                                 # Variables d'environnement (non versionnées)
└── .gitignore                           # Fichiers exclus du versionnement
```

---

## ⚙️ Fonctionnement Interne

### Routage Nuxt (File-Based Routing)

L'application repose sur le routage par convention de fichiers de Nuxt 4 :

- `app.vue` → enveloppe globale avec `<NuxtLayout>` + `<NuxtPage />`
- Trois layouts coexistent : `default` (public), `dashboard` (citoyen), `dashboard_admin` (admin)
- Les routes dynamiques `[id]` et `[addressId]` gèrent les pages utilisateur et les fiches d'adresses

### Gestion d'état par Composables Singleton

L'état global est partagé via des variables `ref` déclarées **au niveau module** (hors de la fonction exportée). Ainsi, chaque composant qui appelle le composable (ex: `useAuth()`) s'abonne à la **même instance réactive**, éliminant le besoin de Pinia ou de props-drilling complexe.

### Client HTTP Global

Le plugin `api.client.ts` crée une instance `$fetch` personnalisée avec :
- `baseURL` pointant vers le serveur API (`NUXT_PUBLIC_GEOLINK_FINDME`)
- **Intercepteur de requêtes** pour le logging
- **Intercepteur de réponses** pour la gestion automatique des sessions (création du cookie `findme_session` après login/signup/OAuth)
- **Intercepteur d'erreurs** pour l'affichage automatique des toasts d'erreur

### Persistance Locale (`useMemory`)

Le composable générique `useMemory<T>` synchronise automatiquement n'importe quelle structure de données avec `localStorage` :
- Chargement initial depuis le stockage
- Auto-sauvegarde à chaque mutation (via `watch` profond)
- Méthodes utilitaires : `loadInStorage`, `saveInStorage`, `clearStorage`, `filterInStorage`

---

## 🚀 Lancement du Projet en Développement

### Prérequis

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (ou équivalent : yarn, pnpm)

### 1. Cloner le dépôt

```bash
git clone <url-du-dépôt>
cd my-find-me
```

### 2. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# URL publique de l'application
NUXT_PUBLIC_URL=http://localhost:3000

# URL de l'API backend (serveur mock ou réel)
NUXT_PUBLIC_GEOLINK_FINDME=http://localhost:8080

# Token d'accès Mapbox (pour le géocodage inversé)
NUXT_PUBLIC_MAPBOX_TOKEN=pk.xxxxxxxxxxxxxxxxxxxxxxx

# Numéro WhatsApp pour le support client
NUXT_PUBLIC_WHATSAPP_NUMBER=+237XXXXXXXXX

# Client ID Google Sign-In (depuis Google Cloud Console)
NUXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
```

### 3. Installer les dépendances

```bash
npm install
```

### 4. Lancer le serveur de développement

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3000` avec **hot-reload** activé et accessible depuis d'autres appareils sur le réseau local (flag `--host`).

### 5. Autres commandes

| Commande | Description |
| --- | --- |
| `npm run dev` | Serveur de développement avec hot-reload (accessible réseau local) |
| `npm run build` | Compilation du livrable de production |
| `npm run generate` | Génération de site statique (SSG) |
| `npm run preview` | Prévisualisation du build de production |

---

## 📝 Notes

- Le projet utilise le **Nuxt DevTools** (activé par défaut via `devtools: { enabled: true }`)
- La politique CORS est configurée via Nitro (`Cross-Origin-Opener-Policy: unsafe-none`) pour permettre la communication avec la pop-up Google Sign-In
- Les données statiques (fonctionnalités, témoignages, étapes) sont stockées dans `app/data/` au format JSON pour faciliter la maintenance
