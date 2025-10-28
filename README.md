# logeFinder  
Une application full-stack (backend + frontend) visant à faciliter la recherche de logements.

---

## 🧭 Table des matières  
- [Description](#description)  
- [Fonctionnalités](#fonctionnalités)  
- [Technologies](#technologies)  
- [Architecture & arborescence](#architecture--arborescence)  
- [Installation & lancement](#installation--lancement)  
- [Utilisation](#utilisation)  

---

## 🏡 Description  
**logeFinder** est une solution qui permet aux utilisateurs de rechercher des logements (appartements, maisons, studios…) via une interface web moderne, avec un backend permettant de gérer les données, l’authentification et les API.  

L’objectif est de proposer une plateforme simple, efficace et extensible pour la recherche de logement, que ce soit pour les locataires ou les propriétaires.

---

## ✨ Fonctionnalités  
- 🔍 Recherche de logements selon critères (localisation, prix, type, etc.)  
- 🗺️ Affichage des résultats en liste ou sur une carte (si géolocalisation précisée)  
- 🏠 Fiche détaillée pour chaque logement (photos, description, équipements…)  
- 👤 Authentification utilisateur (connexion, inscription)  
- ⚙️ Backend API REST pour la gestion des données immobilières  
- 💻 Interface frontend réactive et moderne  
- 🧰 Scripts utilitaires (dans le dossier `scripts`) pour automatisation ou peuplement de données  

---

## 🛠️ Technologies  
Les principales technologies utilisées dans ce projet sont :  
- **Backend** : JavaScript avec Node.js 22.17.0 et Express
- **Frontend** : JavaScript / TypeScript avec Angular 19.2.14
- **Structure** : Mono-repo avec `backend/`, `frontend/`, et `scripts/`
- **Gestion des dépendances** : `package.json` (Node.js)
- **Contrôle de version** : Git + GitHub
- **Scripts** : Python 3.12.0

---

## 🧱 Architecture & arborescence  

/                 ← racine du projet
├─ backend/        ← code du serveur (API, base de données, etc.)
├─ frontend/       ← code de l’interface utilisateur (web)
├─ scripts/        ← utilitaires, scripts d’automatisation et de peuplement
├─ .gitignore
└─ package.json    ← gestion des dépendances

Cette organisation permet de séparer clairement le frontend et le backend, facilitant ainsi le développement, les tests et le déploiement.

---

## ⚙️ Installation & lancement
## 🧩 Prérequis

Node.js et npm (ou yarn) installés

Python installé

(Optionnel) Une base de données configurée (ex. PostgreSQL, MySQL, SQLite)

---

## 🚀 Étapes d’installation

### 1. Cloner le dépôt

git clone https://github.com/Dyluan/logeFinder.git  
cd logeFinder  

### 2. Installer les dépendances

### Backend

cd backend  

#### Installer les dépendances Node  

npm install    # ou yarn install  

#### Lancer le serveur API  

node app.js  

### Frontend

cd ../frontend  
npm install     ou yarn install  
npm start       ou yarn start  

Une fois le projet lancé, ouvrez votre navigateur à l’adresse indiquée (ex. http://localhost:4200).

---

## 💡 Utilisation

En tant qu’utilisateur, vous pouvez vous inscrire ou vous connecter avec Google pour rechercher des logements, retrouver les logements ajoutés au favoris, etc..  

En tant qu’administrateur ou propriétaire, vous pouvez ajouter, modifier ou supprimer des annonces.  

Une API REST est disponible pour des intégrations externes (import d’annonces, synchronisation de données, etc.)  
