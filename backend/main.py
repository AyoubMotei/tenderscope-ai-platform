import logging
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import jose.jwt as jwt
from passlib.context import CryptContext
import os
from typing import List, Optional
import models, schemas
from database import engine, get_db
from ai_engine import compute_score


from services.rag_engine import rag_assistant  # Import de ton moteur fonctionnel


# --- Configuration des Logs ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Configuration Sécurité (JWT) ---
SECRET_KEY = os.getenv("SECRET_KEY", "My_very_protected_second_key_123")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI(title="TenderScope AI - Backend Officiel")

# --- Fonctions Utilitaires ---
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# --- Endpoints Authentification ---

@app.post("/register", response_model=schemas.Token)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")
    
    hashed_pwd = pwd_context.hash(user.password)
    new_user = models.User(
        email=user.email,
        hashed_password=hashed_pwd,
        company_name=user.company_name,
        sector=user.sector,
        city=user.city,
        description=user.description
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(data={"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/token", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not pwd_context.verify(form_data.password, user.hashed_password):
        logger.warning(f"Tentative de connexion échouée pour : {form_data.username}")
        raise HTTPException(status_code=401, detail="Identifiants incorrects")
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# --- Endpoints Métier ---

@app.get("/tenders", response_model=list[schemas.TenderResponse])
def get_all_tenders(db: Session = Depends(get_db)):
    return db.query(models.Tender).all()

@app.post("/match", response_model=list[schemas.MatchResponse])
def match_tenders(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    # 1. Identifier l'utilisateur via le Token
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
    except:
        raise HTTPException(status_code=401, detail="Token invalide")

    user = db.query(models.User).filter(models.User.email == email).first()
    tenders = db.query(models.Tender).all()
    
    company_profile = f"{user.sector} {user.description} {user.city}"
    results = []

    for tender in tenders:
        tender_text = f"{tender.domain} {tender.description} {tender.city}"
        score, decision = compute_score(company_profile, tender_text)
        
        # 2. Sauvegarder le score en base (Validation Persistence)
        new_score = models.Score(user_id=user.id, tender_id=tender.id, score=score, decision=decision)
        db.add(new_score)
        
        results.append({
            "tender_title": tender.title,
            "score": score,
            "decision": decision
        })

    db.commit()
    logger.info(f"Matching réussi pour l'utilisateur {user.email}")
    return sorted(results, key=lambda x: x["score"], reverse=True)


@app.post("/ask-tender", response_model=schemas.AnswerResponse)
async def ask_tender_question(
    request: schemas.QuestionRequest, 
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)  
):
    try:
        # 1. Identification de l'utilisateur via le token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        user = db.query(models.User).filter(models.User.email == email).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

        # 2. Appel au moteur RAG
        result_rag = rag_assistant.get_response(request.question)
        answer_text = result_rag['result']
        
        # 3. SAUVEGARDE DANS LA BASE DE DONNÉES (L'étape manquante !)
        new_chat = models.ChatHistory(
            user_id=user.id,
            question=request.question,
            answer=answer_text
        )
        db.add(new_chat)
        db.commit() # On valide l'écriture dans PostgreSQL
        
        logger.info(f"Question stockée en DB pour l'utilisateur : {email}")

        return schemas.AnswerResponse(
            question=request.question,
            answer=answer_text
        )
    except Exception as e:
        logger.error(f"Erreur: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur interne du serveur")



@app.get("/chat-history", response_model=List[schemas.ChatHistoryResponse])
async def get_chat_history(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    Récupère l'historique des questions/réponses de l'utilisateur connecté.
    """
    try:
        # 1. Identifier l'utilisateur via le token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        user = db.query(models.User).filter(models.User.email == email).first()

        if not user:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

        # 2. Récupérer l'historique trié par date (du plus récent au plus ancien)
        history = db.query(models.ChatHistory)\
            .filter(models.ChatHistory.user_id == user.id)\
            .order_by(models.ChatHistory.created_at.desc())\
            .all()

        return history

    except Exception as e:
        logger.error(f"Erreur lors de la récupération de l'historique : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur interne du serveur")