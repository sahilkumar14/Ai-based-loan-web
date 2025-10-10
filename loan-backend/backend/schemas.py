from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str
    photo: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    role: Optional[str] = None

class LoanBase(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    loanAmount: float
    purpose: str | None = None
    loanDuration: int | None = None
    familyannualincome: float | None = None
    creditScore: int | None = None
    previousDefaults: str | None = None
    aadhar: str | None = None
    dob: str | None = None

class LoanResponse(LoanBase):
    id: int
    fraudScore: float
    status: str
    requestDate: str
    class Config:
        from_attributes = True

class LoanStatusUpdate(BaseModel):
    status: str
