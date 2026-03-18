from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    company_name: str
    sector: str
    city: str
    description: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TenderResponse(BaseModel):
    id: int
    title: str
    organization: str
    city: str
    domain: str
    description: str
    class Config:
        from_attributes = True

class MatchResponse(BaseModel):
    tender_title: str
    score: float
    decision: str

# --- Nouveaux modèles pour le RAG ---

class QuestionRequest(BaseModel):
    question: str

class AnswerResponse(BaseModel):
    question: str
    answer: str

class ChatHistoryResponse(BaseModel):
    id: int
    question: str
    answer: str
    created_at: datetime
    class Config:
        from_attributes = True
