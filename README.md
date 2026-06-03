# 🗺️ findMe Cameroun - Portail National d'Adressage Civique Standardisé

Bienvenue sur le projet **findMe Cameroun** ! 

Cette application est un portail citoyen interactif de haute fidélité conçu pour permettre aux citoyens d'enregistrer, d'homologuer et de partager leur adresse domiciliaire conformément aux normes d'adressage municipal de la République du Cameroun. Elle s'appuie sur une charte graphique **Néobrutaliste** à fort impact visuel, soignée et réactive.

---

## 🛠️ Architecture du Projet

Le projet est configuré sous **Nuxt 3 / Nuxt 4 (Vue.js)**, en utilisant **TypeScript** pour la sécurité de typage et **Tailwind CSS** pour l'intégralité du design stylistique.

Voici l'organisation des répertoires clés du projet :

```text
├── /app/
│   ├── app.vue                   # Racine de l'application (Main Layout Shell, Modals & Toast)
│   ├── /pages/
│   │   └── index.vue             # Point d'entrée principal des routes Nuxt (<NuxtPage>)
│   ├── /components/
│   │   ├── Header.vue            # Barre de navigation nationale
│   │   ├── Hero.vue              # Message d'accueil et entête héroïque
│   │   ├── HowItWorks.vue        # Guide interactif pas-à-pas pour la création d'adresse
│   │   ├── Features.vue          # Présentation des caractéristiques techniques
│   │   ├── Testimonials.vue      # Avis & retours d'expérience citoyens réels
│   │   ├── Faq.vue               # Questions fréquentes sur l'adressage municipal
│   │   ├── Footer.vue            # Pied de page officiel récapitulatif
│   │   ├── GlobalCitizenMap.vue  # Carte géospatiale globale ou Espace Citoyen interactif
│   │   ├── /citizen-map/
│   │   │   └── MapGridSatellite.vue # Vue de grille de simulation satellite d'adressage
│   │   └── /address-form/
│   │       ├── FormGeolocator.vue    # Module de géolocalisation et configuration GPS
│   │       └── FormPhotoCapture.vue  # Module de capture de façade par Webcam ou simulation
│   ├── /composables/
│   │   ├── useAddresses.ts       # Orchestration réactive CRUD des adresses citoyennes
│   │   ├── useAddressExporter.ts # Logique de génération et d'export en SVG / PDF (jsPDF)
│   │   ├── useAuth.ts            # Gestion simulée de l'authentification citoyenne
│   │   ├── useCameraAndPhoto.ts  # Gestion d'accès webcam et compression d'images d'entrée
│   │   ├── useLanguage.ts        # Gestion globale du bilinguisme actif (FR / EN)
│   │   ├── useNavigation.ts      # Gestion de la navigation entre l'accueil et la console
│   │   ├── useTheme.ts           # Logique globale de Dark Mode / Thème clair
│   │   ├── useShare.ts           # Partage d'adresses via WhatsApp, Email et Copie de lien
│   │   ├── useToasts.ts          # Système centralisé de notifications évasives "Toasts"
│   │   └── useValidation.ts      # Moteur de validation des codes postaux et numéros
│   └── types.ts                  # Types TypeScript stricts pour l'adressage
├── package.json                  # Dépendances NPM et scripts système de l'application
├── tailwind.config.ts            # Configuration des styles utilitaires Tailwind
└── nuxt.config.ts                # Configuration globale du framework Nuxt de production
```

---

## ⚙️ Fonctionnement des Éléments Clés

### 1. Routage dynamique de Nuxt
L'application utilise le moteur de routage natif de Nuxt.
* **`app.vue`** agit comme l'enveloppe globale. Elle héberge le **Header**, le **Footer**, l'arrière-plan de l'application, ainsi que tous les **modals globaux** (Connexion citoyenne, Création d'adresses, Détails d'adresses, Système d'alertes de suppression irreversible) et le contrôleur de notifications **Toasts**. Cela permet de préserver l'état de ces modaux de façon fluide lors des transitions.
* **`pages/index.vue`** est instanciée via l'élément `<NuxtPage />` dans `app.vue`. Elle héberge la vue dynamique par défaut, à savoir la page de présentation publique (avec son guide interactif wizard) et la **Console de l'Espace Citoyen** visible une fois l'utilisateur authentifié.

### 2. Gestion centralisée des Composables (Shared States)
Toutes les variables d'état (langue active, adresses enregistrées, session utilisateur connectée, toasts affichés) sont construites via des variables réactives `ref` instanciées au niveau du module (hors de l'export de la fonction composable).
* **Partage d'état universel** : Lorsqu'un composant importe et invoque un composable (ex: `const { currentLang } = useLanguage()`), il s'abonne à la même référence globale unique, ce qui élimine le besoin d'échanges d'événements complexes (Props/Emit) et simplifie la structure de l'application.

---

## 🎨 Fonctionnalités Majeures Implémentées

### 🌟 1. Espace Citoyen & Dashboard Interactif
* **Persistance Réactive** : Console d'administration permettant de visualiser l'historique complet de ses adresses enregistrées.
* **Double Vue** : Possibilité d'afficher ses adresses soit sous forme de **Cartes Néobrutalistes** élégantes avec photos, coordonnées géo-localisées et codes uniques, soit sur la **Carte Interactive Globale**.

### 🗺️ 2. Carte Interactive & Grille Géospatiale
* Visualisation géospatiale avancée sur un canevas interactif répertoriant toutes les adresses actives simulées sur le territoire camerounais.
* Intégration d'une **boussole gyroscopique**, d'indicateurs de coordonnées et de zones de zoom.

### 📄 3. Export PDF & Générateur de Plaques Vectorielles SVG
* **Certificats Classés PDF** : Export instantané sous format de certificat officiel de localisation via la librairie `jsPDF`.
* **Dessin Vectoriel SVG** : Génération et téléchargement dynamique à la volée du code SVG de la plaque d'adressage normée bleue findMe (prête pour l'impression industrielle).

### 📷 4. Capture photo Webcam & Moteur de Compression
* Accès à la webcam de l'appareil (`navigator.mediaDevices.getUserMedia`) pour filmer et capturer la façade du domicile en direct.
* **Moteur d'Optimisation d'Image** : Compression automatique de la photo capturée ou téléversée vers le format JPEG optimisé, affichant en temps réel le taux de réduction de l'empreinte carbone pour l'environnement (ex: `-84%` de stockage économisé).

### ✍️ 5. Formulaire d'Adressage Sécurisé avec Éco-Garantie
* Recherche d'arrondissement guidée avec repères visuels intuitifs.
* Validation rigoureuse par regex des numéros de voirie municipaux et formats de codes postaux officiels du Cameroun.

### 🗣️ 6. Système Bilingue & Mode Sombre "Cyber-Dark"
* Localisation bilingue intégrale et fluide à la volée (**Français / Anglais**).
* Support complet du thème de couleurs, allant du blanc néobrutaliste épuré avec de fortes ombres de noir au mode sombre cybernétique raffiné.

---

## 🚀 Lancement du projet en développement

1. Installez les packages requis :
   ```bash
   npm install
   ```
2. Démarrez le serveur de développement :
   ```bash
   npm run dev
   ```
3. Compilez le livrable final de production :
   ```bash
   npm run build
   ```
