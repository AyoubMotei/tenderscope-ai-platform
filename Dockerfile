# ==========================================
# TenderScope AI - Configuration Docker Complète
# ==========================================
# Ce fichier Dockerfile à la racine est fourni à titre informatif.
# Pour ce projet multi-services (Next.js + FastAPI + Postgres), 
# il est fortement recommandé d'utiliser 'docker-compose' :
#
#   $ docker-compose up --build
#
# Cependant, voici un Dockerfile multi-stage si vous souhaitez 
# un conteneur unique (via une approche simplifiée).
# ==========================================

# STAGE 1 : Build Backend
FROM python:3.11-slim as backend-builder
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')"

# STAGE 2 : Build Frontend
FROM node:20-alpine as frontend-builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# STAGE FINAL : Image de Production
# Note : Pour un déploiement réel, Docker Compose est préférable.
FROM python:3.11-slim
WORKDIR /app

# Récupérer les dépendances et le modèle du backend
COPY --from=backend-builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=backend-builder /usr/local/bin /usr/local/bin
COPY --from=backend-builder /root/.cache/torch /root/.cache/torch

# Récupérer le code source
COPY backend/ ./backend
COPY frontend/ ./frontend

# Exposer les ports (Backend: 8000, Frontend: 3000)
EXPOSE 8000
EXPOSE 3000

# Script de démarrage pour lancer les deux (Exemple simple)
# Dans un cas réel, utilisez supervisord ou docker-compose.
CMD ["sh", "-c", "cd backend && uvicorn main:app --host 0.0.0.0 --port 8000 & cd frontend && npm start"]
