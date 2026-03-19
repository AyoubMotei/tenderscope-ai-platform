# 🚀 TenderScope AI

<p align="center">
  <em>Plateforme intelligente d’aide à la décision pour l’analyse et la qualification des appels d’offres publics marocains (B2B SaaS).</em>
</p>

---

## 📖 À propos du projet

**TenderScope AI** est un produit minimum viable (MVP) développé en tant que projet de fin d'études dans le cadre d'une formation de Développeur IA. 

Cette plateforme SaaS B2B utilise l'Intelligence Artificielle et le Traitement du Langage Naturel (NLP) pour aider les PME marocaines à évaluer rapidement si un appel d'offres public correspond à leur profil, leurs compétences et leur secteur d'activité, avant même d'investir des ressources dans sa préparation.

---

## 🎯 La Problématique

Au Maroc, les appels d’offres publics représentent une source majeure d’opportunités économiques pour les entreprises, particulièrement les PME. Cependant, le processus de qualification est semé d'embûches :

- **Surcharge d'informations :** Les appels d'offres sont nombreux et dispersés.
- **Perte de temps :** L'analyse manuelle des documents pour vérifier l'éligibilité est extrêmement chronophage.
- **Inefficacité :** De nombreuses entreprises perdent du temps et de l'argent à analyser des marchés qui ne correspondent finalement pas à leurs capacités.
- **Complexité des données :** Les informations sont textuelles, denses et non structurées.

**Conséquence :** Les entreprises manquent d'un outil d'aide à la décision préliminaire pour identifier rapidement les bons appels d'offres.

---

## 💡 Notre Solution

**TenderScope AI** résout ce problème en automatisant l'analyse de compatibilité. Le système ne remplace pas l'humain pour la réponse à l'appel d'offres, mais agit comme un **assistant de qualification intelligent et d'aide à la décision**.

Grâce à l'IA, la plateforme compare sémantiquement le profil de votre entreprise avec les exigences de l'appel d'offres, génère un **score de pertinence (0-100%)**, et vous fournit un assistant conversationnel pour poser des questions spécifiques sur le marché.

---

## ✨ Fonctionnalités Réalisées

Au cours de ce projet, les fonctionnalités suivantes ont été implémentées avec succès :

1. **🧑‍💼 Gestion du Profil Entreprise**
   - Création et modification du profil de l'entreprise (nom, secteur, ville, description des activités).
   
2. **📂 Hub des Appels d'Offres**
   - Affichage d'une liste centralisée d'appels d'offres publics marocains (données synthétiques pour le MVP : IT, BTP, Services).

3. **🧠 Moteur de Matching IA (Scoring)**
   - Algorithme d'Intelligence Artificielle calculant un score de compatibilité entre le profil de l'entreprise et la description de l'appel d'offres.
   - Utilisation de modèles "Sentence Transformers" pour la similarité sémantique (Cosine Similarity).

4. **📊 Tableau de Bord (Dashboard) Analytique**
   - Interface claire affichant les appels d'offres classés par pertinence.
   - Recommandation claireisée d'aide à la décision.

5. **💬 Assistant IA Conversationnel (RAG)**
   - Chatbot intégré utilisant la technologie RAG (Retrieval-Augmented Generation).
   - Possibilité de poser des questions spécifiques à l'IA concernant un appel d'offres ("Quels sont les délais ?", "Ma PME est-elle éligible ?").

6. **🔒 Sécurité et Authentification**
   - Système de connexion sécurisé avec tokens JWT.

---

## 🛠️ Stack Technique

Le projet repose sur une architecture moderne, robuste et full-stack :

**Frontend (Interface Utilisateur)**
- **Framework :** Next.js (React)
- **Styling :** Tailwind CSS
- **Design :** Premium SaaS (Dark mode élégant, interface professionnelle)

**Backend (API & Logique métier)**
- **Framework :** FastAPI (Python)
- **Serveur :** Uvicorn
- **ORM :** SQLAlchemy

**Data & Intelligence Artificielle**
- **Base de données relationnelle :** PostgreSQL
- **Base de données vectorielle :** ChromaDB (pour le système RAG)
- **NLP / Embeddings :** Sentence Transformers, Hugging Face
- **Machine Learning :** Scikit-learn (pour la similarité cosinus)

**DevOps & Déploiement**
- **Conteneurisation :** Docker & Docker Compose

---

## 🏗️ Architecture du Système

Le flux de données suit une architecture logique et optimisée :

```text
[ Interface Utilisateur (Next.js) ]
                ⬇
[ API REST Backend (FastAPI) ] ➔ [ Authentification JWT ]
                ⬇
[ Moteur IA (Sentence Transformers + ChromaDB) ] 
                ⬇
[ Base de Données (PostgreSQL) ]
```

---

## 🚀 Guide d'Installation et d'Utilisation

L'application a été "Dockerisée" pour garantir une installation simple en une seule commande, sans conflit de dépendances.

### 📋 Prérequis
- [Docker](https://www.docker.com/) et [Docker Compose](https://docs.docker.com/compose/) installés sur votre machine.
- Git.

### 🔧 Installation

1. **Cloner le répertoire :**
   ```bash
   git clone https://github.com/votre-repo/tenderscope-ai-platform.git
   cd tenderscope-ai-platform
   ```

2. **Lancer l'application avec Docker :**
   Exécutez la commande suivante à la racine du projet pour construire et démarrer tous les services (Frontend, Backend, PostgreSQL) :
   ```bash
   docker-compose up --build
   ```

3. **Accéder à l'application :**
   - Frontend (Application Web) : [http://localhost:3000](http://localhost:3000)
   - Backend (Documentation API Swagger) : [http://localhost:8000/docs](http://localhost:8000/docs)

### 💡 Comment utiliser l'application ?

1. **Inscription / Connexion :** Créez un compte ou connectez-vous.
2. **Profil :** Dirigez-vous vers la page "Profil" et renseignez l'expertise détaillée de votre entreprise. *C'est sur ce texte que l'IA va se baser !*
3. **Dashboard :** Allez sur le Dashboard. L'IA va automatiquement analyser les appels d'offres disponibles et les classer par ordre de pertinence (Score de 0 à 100%).
4. **Assistant IA :** Cliquez sur l'Assistant. Posez des questions en langage naturel sur les marchés publics. L'IA analysera l'historique et les données pertinentes pour vous répondre avec précision.

---

## 🤖 L'Intelligence Artificielle dans TenderScope

Le cœur de valeur de TenderScope réside dans ses deux moteurs IA :

1. **Le Moteur de Matching (Similarité Sémantique) :**
   Il transforme le texte du profil de votre entreprise et le texte de l'appel d'offres en vecteurs mathématiques (Embeddings) grâce à des modèles NLP avancés. Il calcule ensuite la distance (Cosine Similarity) entre ces deux vecteurs pour générer un score de pertinence fiable.

2. **Le système RAG (Retrieval-Augmented Generation) :**
   Contrairement à un ChatGPT classique qui génère des réponses générales, notre assistant IA recherche d'abord les informations spécifiques (Retrieval) dans la base de données vectorielle (ChromaDB) des appels d'offres, puis utilise ces faits exacts pour générer (Generation) une réponse précise et contextualisée à l'utilisateur.

---

## 🔮 Évolutions Futures (Post-MVP)

Bien que ce MVP soit totalement fonctionnel, plusieurs évolutions sont envisagées pour une version de production :

- **Scraping automatisé :** Récupération en temps réel des appels d'offres depuis les portails gouvernementaux marocains.
- **Analyse de documents (PDF) :** Intégration de l'OCR pour lire et analyser automatiquement les Cahiers des Prescriptions Spéciales (CPS) complets de dizaines de pages.
- **Alertes automatiques :** Notifications par email dès qu'un marché avec un score > 80% est publié.
- **Déploiement Cloud :** Hébergement sur AWS ou GCP pour scalabilité.

---

## 👨‍💻 Auteur

**MOTEI AYOUB**  
*Projet de fin d'études - Formation Développeur IA*