# ChillMovies 🎬

[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![NodeJS](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![Sequelize](https://img.shields.io/badge/ORM-Sequelize-52b0e7?style=for-the-badge&logo=sequelize)](https://sequelize.org/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479a1?style=for-the-badge&logo=mysql)](https://www.mysql.com/)

Une plateforme moderne, fluide et élégante de gestion et de recommandation de films, séries et documentaires. Conçue avec une architecture découplée **MERN** (MySQL, Express, React, Node), **ChillMovies** offre une expérience utilisateur haut de gamme avec une gestion de catalogue sécurisée et personnalisée.

---

## 📌 Sommaire

1. [Introduction](#-introduction)
2. [Présentation du Projet & Objectifs](#-présentation-du-projet--objectifs)
3. [Fonctionnalités Principales](#-fonctionnalités-principales)
4. [Stack Technique](#-stack-technique)
5. [Architecture Globale](#-architecture-globale)
6. [Structure des Dossiers](#-structure-des-dossiers)
7. [Prérequis Système](#-prérequis-système)
8. [Installation Pas à Pas](#-installation-pas-à-pas)
9. [Configuration des Variables d'Environnement](#-configuration-des-variables-denvironnement)
10. [Mise en Marche en Local](#-mise-en-marche-en-local)
11. [Scripts Utiles](#-scripts-utiles)
12. [Cas d'Usage Typique](#-cas-dusage-typique)
13. [Pistes d'Amélioration](#-pistes-damélioration)
14. [Auteur & Licence](#-auteur--licence)

---

## 📖 Introduction

**ChillMovies** est une application web full-stack développée pour les passionnés de cinéma et de séries. Elle permet de répertorier, structurer et suivre ses œuvres favorites à travers une interface épurée, sombre et animée, inspirée des leaders du streaming moderne.

---

## 🎯 Présentation du Projet & Objectifs

L'objectif principal de ChillMovies est de fournir un espace personnalisé où chaque utilisateur possède le contrôle total de son catalogue. 

Contrairement aux bases de données publiques et impersonnelles, ChillMovies met l'accent sur la confidentialité et la création individuelle : **chaque utilisateur ne peut visualiser, modifier ou supprimer que le contenu qu'il a lui-même enregistré.** 

### Pour qui a été conçu ce projet ?
- **Les cinéphiles** désirant organiser leur collection personnelle de films et séries.
- **Les développeurs** cherchant un exemple d'architecture robuste combinant un backend Node/Express/Sequelize et un frontend React moderne sous Vite.

---

## ✨ Fonctionnalités Principales

| Fonctionnalité | Description | Technologies Clés |
| :--- | :--- | :--- |
| **Authentification Sécurisée** | Inscription et connexion avec chiffrement des mots de passe et sessions par jeton JWT. | `bcrypt`, `jsonwebtoken` |
| **Gestion du Catalogue (CRUD)** | Ajout, modification, consultation et suppression de films, séries ou documentaires. | `Sequelize`, `React Forms` |
| **Restriction de Propriété** | Middleware de sécurité interdisant l'accès ou la modification des données par un autre utilisateur que leur créateur. | Express Middleware |
| **Favoris Personnels** | Ajout et retrait d'œuvres à une liste de favoris personnelle via une association N:N. | Sequelize Join Table |
| **Upload d'Affiches** | Stockage et affichage d'images de couverture personnalisées pour chaque œuvre. | `Multer` |
| **Interface Responsive** | Design sombre haut de gamme, fluide et entièrement adapté aux mobiles et tablettes. | `Tailwind CSS`, `Lucide React` |

---

## 🛠 Stack Technique

### Backend (Serveur d'API)
- **Runtime** : [Node.js](https://nodejs.org/) (gestion asynchrone des requêtes)
- **Framework** : [Express.js](https://expressjs.com/) (routage et gestion des middlewares)
- **Base de Données** : [MySQL](https://www.mysql.com/) (stockage relationnel robuste)
- **ORM** : [Sequelize](https://sequelize.org/) (modélisation de données et requêtes SQL simplifiées)
- **Sécurité & Outils** : `bcrypt` (chiffrement), `jsonwebtoken` (authentification sans état), `multer` (traitement des uploads), `helmet` & `cors` (sécurisation des requêtes HTTP).

### Frontend (Interface Utilisateur)
- **Outil d'Assemblage** : [Vite](https://vite.dev/) (build ultra-rapide)
- **Bibliothèque Principale** : [React.js](https://react.dev/) (architecture basée sur les composants)
- **Routage** : [React Router Dom v7](https://reactrouter.com/) (navigation fluide sans rechargement)
- **Styling** : [Tailwind CSS](https://tailwindcss.com/) (design moderne et responsive)
- **Icônes** : [Lucide React](https://lucide.dev/) (bibliothèque d'icônes vectorielles épurées)
- **Tests** : [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/) (tests unitaires et d'intégration robustes)

---

## 📐 Architecture Globale

Le projet suit une architecture moderne découplée de type **Client-Serveur** :

```mermaid
graph LR
    subgraph Frontend (React / Vite)
        A[Interface Utilisateur] -->|Requêtes HTTP + JWT| B[Service API / Axios]
    end

    subgraph Backend (Express / Node)
        B -->|Appel API| C[Routes]
        C -->|Vérification Authentification| D[Middleware Auth]
        D -->|Validation Propriété| E[Middleware Restrict]
        E -->|Exécution Logique| F[Contrôleurs]
        F -->|ORM| G[Modèles Sequelize]
    end

    subgraph Base de Données (MySQL)
        G -->|Lecture / Écriture| H[(MySQL Database)]
    end
```

---

## 📂 Structure des Dossiers

Voici l'arborescence simplifiée du projet ChillMovies :

```text
ChillMovies/
├── backend/                  # Partie Serveur (Node.js/Express)
│   ├── config/               # Configuration de la base de données
│   ├── controllers/          # Logique métier (Auth, Contents, Favorites)
│   ├── middlewares/          # Middlewares (Auth, Restrict, Multer...)
│   ├── models/               # Modèles Sequelize (User, Content, Favorite)
│   ├── routes/               # Endpoints de l'API REST
│   ├── uploads/              # Stockage local des images de couverture
│   ├── utils/                # Fonctions utilitaires
│   ├── server.js             # Point d'entrée de l'API
│   └── package.json
│
├── frontend/                 # Partie Client (React/Vite)
│   ├── src/
│   │   ├── components/       # Composants UI réutilisables
│   │   ├── context/          # Contextes globaux (AuthContext...)
│   │   ├── pages/            # Pages de l'application (Home, Login, Profile...)
│   │   │   └── __tests__/    # Tests unitaires et d'intégration Vitest
│   │   ├── services/         # Appels API (Axios client)
│   │   ├── index.css         # Styles globaux & Variables
│   │   └── main.jsx          # Point d'entrée React
│   ├── vite.config.js        # Configuration Vite
│   └── package.json
└── README.md
```

---

## ⚙️ Prérequis Système

Pour faire fonctionner le projet localement, assurez-vous d'avoir installé :
- [Node.js](https://nodejs.org/) (Version **18.x** ou supérieure recommandée)
- [npm](https://www.npmjs.com/) (installé automatiquement avec Node)
- [MySQL Server](https://www.mysql.com/downloads/) (local ou hébergé)

---

## 🚀 Installation Pas à Pas

### 1. Cloner le projet
```bash
git clone https://github.com/votre-compte/ChillMovies.git
cd ChillMovies
```

### 2. Configurer le Backend
```bash
cd backend
npm install
```

### 3. Configurer le Frontend
```bash
cd ../frontend
npm install
```

---

## 🔑 Configuration des Variables d'Environnement

Le projet utilise des variables d'environnement pour sécuriser les configurations sensibles.

### Backend (`backend/.env`)
Créez un fichier `.env` dans le dossier `backend/` et complétez les informations suivantes :

```env
PORT=3000
JWT_SECRET=votre_cle_secrete_jwt
DB_USER=votre_utilisateur_mysql
DB_PASSWORD=votre_mot_de_passe_mysql
DB_NAME=chillmovies
DB_HOST=127.0.0.1
DB_PORT=3306
```

---

## 🖥️ Mise en Marche en Local

### 1. Lancer le serveur Backend (API)
Depuis le dossier `backend/` :
```bash
npm run dev
```
Le serveur démarrera par défaut sur [http://localhost:3000](http://localhost:3000).

### 2. Lancer l'application Frontend
Depuis le dossier `frontend/` :
```bash
npm run dev
```
L'interface utilisateur sera accessible sur [http://localhost:5173](http://localhost:5173).

---

## 📊 Scripts Utiles

### Dans le dossier `backend/`
| Commande | Action |
| :--- | :--- |
| `npm run dev` | Lance le serveur en mode développement avec redémarrage automatique (`nodemon`). |
| `npm start` | Démarre le serveur Node classique (production). |

### Dans le dossier `frontend/`
| Commande | Action |
| :--- | :--- |
| `npm run dev` | Démarre le serveur de développement Vite. |
| `npm run build` | Compile l'application pour la production. |
| `npm test` | Exécute la suite complète de tests de l'application via Vitest. |

---

## 🎬 Cas d'Usage Typique

Voici le parcours standard d'un utilisateur sur ChillMovies :

1. **Création de compte** : L'utilisateur s'enregistre via la page d'inscription. Ses identifiants sont chiffrés et stockés dans la base de données MySQL.
2. **Connexion** : L'utilisateur se connecte et reçoit un jeton d'accès sécurisé JWT, stocké localement.
3. **Exploration du catalogue** : Sur la page d'accueil, l'utilisateur voit exclusivement les films et séries qu'il a lui-même créés.
4. **Gestion du catalogue (CRUD)** : L'utilisateur clique sur "Ajouter un Contenu" pour uploader une image et définir les propriétés de son film. Seul cet utilisateur aura les droits d'éditer ou de supprimer ce film.
5. **Gestion des Favoris** : L'utilisateur peut ajouter ses œuvres à son espace "Favoris" pour un accès rapide.

---

## 💡 Pistes d'Amélioration

Voici quelques évolutions architecturales et fonctionnelles recommandées pour de futures versions :
* **Authentification Sociale** : Ajouter la connexion via Google ou GitHub (OAuth 2.0).
* **Pagination & Recherche Avancée** : Ajouter un système de pagination côté serveur et un filtrage par mots-clés ou notes.
* **Intégration d'API Externe** : Connecter l'application à l'API [TMDb](https://www.themoviedb.org/) pour préremplir automatiquement les informations et les affiches des films.
* **Téléchargement Cloud** : Migrer le stockage local des images (`multer`) vers un service Cloud (comme Cloudinary ou AWS S3) pour faciliter le déploiement multi-serveurs.

---

## ✍️ Auteur & Licence

- **Développeur & Architecte** : [Votre Nom / Pseudo](https://github.com/votre-compte)
- **Licence** : Ce projet est sous licence [ISC](https://opensource.org/licenses/ISC).
