import logging
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import jose.jwt as jwt
from passlib.context import CryptContext
import os

import models, schemas
from database import engine, get_db
from ai_engine import compute_score

# --- Configuration des Logs (Compétence C21) ---
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