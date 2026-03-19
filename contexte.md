# TenderScope AI : Plateforme intelligente d’aide à la décision  
pour l’analyse et la qualification des appels d’offres publics  
marocains (B2B SaaS)

## 1. Présentation générale du projet

### 1.1 Contexte

Au Maroc, les appels d’offres publics représentent une source majeure d’opportunités économiques pour les entreprises, en particulier les PME. Cependant, ces appels d’offres sont :

- nombreux,
- dispersés,
- complexes à analyser,
- chronophages à traiter.

La majorité des entreprises perdent un temps considérable à analyser des appels d’offres non pertinents, ce qui entraîne :

- une perte de ressources,
- une baisse de motivation,
- une inefficacité commerciale.

### 1.2 Présentation de la solution

TenderScope AI est une plateforme SaaS B2B qui utilise l’intelligence artificielle pour :

- collecter les appels d’offres publics marocains,
- analyser leurs métadonnées publiques,
- calculer un score de pertinence (0–100),
- fournir une recommandation claire (GO / NO-GO),
- expliquer les raisons de cette décision,
- permettre une interaction via un assistant IA (RAG).

## 2. Problématique et objectifs

### 2.1 Problématique principale

Comment aider une entreprise marocaine à prendre rapidement une décision pertinente sur un appel d’offres public, avant d’investir du temps et des ressources dans sa préparation ?

### 2.2 Problèmes identifiés

- Difficulté à identifier les appels d’offres réellement adaptés
- Manque de visibilité sur la complexité réelle des marchés
- Absence d’outil d’aide à la décision préliminaire
- Données souvent textuelles et non structurées

### 2.3 Objectifs du projet

**Objectif principal**  
Développer une plateforme intelligente permettant d’analyser automatiquement les appels d’offres publics marocains et de fournir une aide à la décision claire et explicable.

**Objectifs secondaires**

- Centraliser les appels d’offres publics
- Réduire le temps d’analyse humaine
- Valoriser les données publiques via l’IA
- Fournir une base pour une future startup SaaS

## 3. Public cible

### 3.1 Cibles principales (B2B)

- PME marocaines (IT, BTP, services, consulting)
- Cabinets de conseil en marchés publics
- Bureaux d’études
- Entrepreneurs et sociétés de services

### 3.2 Cibles secondaires

- Étudiants en économie / gestion
- Consultants indépendants
- Incubateurs et structures d’accompagnement

## 4. Fonctionnalités principales

### 4.1 Collecte automatique des appels d’offres (ETL)

- Scraping légal des sites publics marocains
- Récupération des métadonnées :
  - titre
  - description
  - organisme
  - type de marché
  - villes
  - date limite
  - budget estimé
  - indication PME

### 4.2 Stockage et structuration des données

- Base de données relationnelle (PostgreSQL)
- Normalisation des champs
- Historisation des appels d’offres

### 4.3 Analyse intelligente et Feature Engineering

- Extraction automatique de caractéristiques :
  - nombre de villes
  - délai restant
  - complexité administrative
  - type de marché (PPP(Partenariat Public-Privé), AO(Appel d’Offres), ouvert…)
- Transformation des données textuelles en variables exploitables

### 4.4 Classification et compréhension NLP (IA)

- Détection automatique du domaine réel du marché
- Analyse du vocabulaire technique
- Similarité sémantique avec le profil entreprise

### 4.5 Calcul du score de pertinence (0–100)

- Score explicable basé sur :
  - adéquation métier
  - compatibilité PME
  - délai
  - complexité
  - géographie
- Génération automatique de la décision :
  - GO
  - NO-GO
  - MAYBE

### 4.6 Assistant IA conversationnel (RAG)

- Système RAG basé sur :
  - appels d’offres similaires
  - règles métier
  - données publiques
- Réponses explicatives aux questions utilisateur

### 4.7 API Backend sécurisée

- API REST développée avec FastAPI
- Authentification JWT
- Endpoints documentés

### 4.8 Interface utilisateur (UI)

- Dashboard clair et intuitif
- Visualisation :
  - score
  - décision
  - raisons
- Chat IA intégré

## 5. Fonctionnalités secondaires (post-MVP)

- Notifications email
- Filtrage avancé
- Comparaison de plusieurs appels d’offres
- Historique des décisions
- Analyse PDF

## 6. Parcours utilisateur

### 6.1 Utilisateur entreprise

1. Connexion sécurisée
2. Accès au dashboard
3. Consultation des appels d’offres
4. Visualisation du score et de la décision
5. Interaction avec l’assistant IA
6. Prise de décision interne

## 7. Contraintes techniques

- Données exclusivement publiques
- Respect du cadre légal
- Temps de développement limité
- Projet solo
- Déploiement cloud léger
- Monitoring basique
- Tests automatisés

## 8. Choix technologiques

**Backend**
- Python
- FastAPI
- SQLAlchemy

**Data & IA**
- PostgreSQL
- scikit-learn
- spaCy / Sentence Transformers
- Qdrant / Chroma

**Frontend**
- NextJS (MVP)

**DevOps**
- Docker
- GitHub Actions
- CI/CD

**Sécurité**
- JWT
- Validation des entrées
- Logs

**Réalisé par : MOTEI AYOUB**