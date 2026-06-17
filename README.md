# 🎫 MonTour — Frontend

> Application mobile et web de gestion de file d'attente virtuelle et de réservation de rendez-vous au Sénégal.

![MonTour](https://img.shields.io/badge/MonTour-v1.0-1C6E8C?style=for-the-badge)
![Ionic](https://img.shields.io/badge/Ionic-Angular-3880FF?style=for-the-badge&logo=ionic)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)

---

## 📱 Aperçu

MonTour permet aux clients de prendre des tickets virtuels et de réserver des rendez-vous auprès de prestataires de services (cliniques, garages, mairies, etc.), sans faire la queue physiquement.

### Rôles disponibles
| Rôle | Description |
|------|-------------|
| **Client** | Recherche des services, prend des tickets, réserve des RDV |
| **Prestataire** | Gère sa file d'attente, ses créneaux et ses rendez-vous |
| **Administrateur** | Gère les utilisateurs et valide les entreprises |

---

## 🚀 Technologies utilisées

- **Ionic 7** + **Angular 17** (standalone components)
- **TypeScript**
- **TailwindCSS** + SCSS
- **Firebase** (Auth + Firestore) via backend API

---

## ⚙️ Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Node.js](https://nodejs.org/) v18 ou supérieur
- [npm](https://www.npmjs.com/) v9 ou supérieur
- [Ionic CLI](https://ionicframework.com/docs/cli)

```bash
npm install -g @ionic/cli
```

---

## 📥 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/DieSylla/montour-frontend.git
cd montour-frontend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer l'URL du backend

Ouvrez le fichier `src/app/services/api.ts` et modifiez l'URL de base :

```typescript
// Développement local
private baseUrl = 'http://localhost:3000/api';

// Ou backend déployé
private baseUrl = 'https://votre-backend.onrender.com/api';
```

---

## ▶️ Lancer l'application

### Mode développement (navigateur)

```bash
ionic serve
```

L'application sera disponible sur **http://localhost:8100**

### Mode mobile (Android)

```bash
ionic capacitor add android
ionic capacitor run android
```

### Mode mobile (iOS)

```bash
ionic capacitor add ios
ionic capacitor run ios
```

---

## 🧪 Comptes de test

> ⚠️ Assurez-vous que le backend est bien démarré avant de tester.

### Administrateur
| Champ | Valeur |
|-------|--------|
| Email | `admin@montour.sn` |
| Mot de passe | `admin123` |

### Prestataire
| Champ | Valeur |
|-------|--------|
| Email | `dr.ndiaye@montour.sn` |
| Mot de passe | `prestataire123` |

### Client
| Champ | Valeur |
|-------|--------|
| Email | `aminata@montour.sn` |
| Mot de passe | `client123` |

---

## 📂 Structure du projet

```
src/
├── app/
│   ├── components/          # Composants réutilisables
│   │   ├── sidebar/         # Navigation latérale desktop
│   │   ├── bottom-nav/      # Navigation mobile client
│   │   └── bottom-nav-provider/  # Navigation mobile prestataire
│   ├── pages/               # Pages de l'application
│   │   ├── login/           # Connexion
│   │   ├── register/        # Inscription
│   │   ├── client-home/     # Accueil client
│   │   ├── provider-dashboard/  # Tableau de bord prestataire
│   │   ├── admin-dashboard/ # Tableau de bord admin
│   │   └── ...
│   ├── services/            # Services API et Auth
│   └── guards/              # Guards de navigation
├── theme/                   # Variables de thème Ionic
└── global.scss              # Styles globaux
```

---

## 🔧 Build production

```bash
ionic build --prod
```

Les fichiers générés se trouvent dans le dossier `www/`.

---

## 📸 Captures d'écran

| Login | Dashboard Prestataire | Dashboard Admin |
|-------|----------------------|-----------------|
| Page de connexion sécurisée | Gestion de la file d'attente | Panneau d'administration |

---

## 👨‍💻 Auteur

**DieSylla**  
Projet de fin d'études — Mémoire 2026  
📧 diesylla@esp.sn

---

## 📄 Licence

Ce projet est développé dans le cadre d'un mémoire académique.
