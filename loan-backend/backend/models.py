from sqlalchemy import Column, Integer, String, Float, DateTime, Enum, Text
from sqlalchemy.sql import func
from .database import Base
import enum

class RoleEnum(str, enum.Enum):
    student = "student"
    distributor = "distributor"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.student)
    photo = Column(Text, nullable=True)

class LoanRequest(Base):
    __tablename__ = "loan_requests"

    id = Column(Integer, primary_key=True, index=True)
    studentName = Column(String, nullable=False)
    studentEmail = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    loanAmount = Column(Float, nullable=False)
    purpose = Column(Text, nullable=True)
    course = Column(String, nullable=True)
    fraudScore = Column(Float, default=0.0)
    status = Column(String, default="under_review")
    requestDate = Column(DateTime(timezone=True), server_default=func.now())
