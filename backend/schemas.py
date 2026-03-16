from pydantic import BaseModel, EmailStr
from typing import List, Optional

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