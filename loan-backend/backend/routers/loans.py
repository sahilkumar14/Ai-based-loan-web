from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import database, models, schemas
import random

router = APIRouter(prefix="/api/loans", tags=["loans"])

@router.get("")
def get_loans(db: Session = Depends(database.get_db)):
    loans = db.query(models.LoanRequest).all()
    return {"requests": loans}

@router.post("/submit")
def submit_loan(data: schemas.LoanBase, db: Session = Depends(database.get_db)):
    fraud_score = random.randint(10, 95)
    new_loan = models.LoanRequest(
        studentName=data.name,
        studentEmail=data.email,
        phone=data.phone,
        loanAmount=data.loanAmount,
        purpose=data.purpose,
        course="N/A",
        fraudScore=fraud_score,
    )
    db.add(new_loan)
    db.commit()
    db.refresh(new_loan)
    return {"message": "Loan submitted successfully", "fraudScore": fraud_score}

@router.post("/{id}/status")
def update_status(id: int, payload: schemas.LoanStatusUpdate, db: Session = Depends(database.get_db)):
    loan = db.query(models.LoanRequest).filter(models.LoanRequest.id == id).first()
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    loan.status = payload.status
    db.commit()
    return {"message": f"Status updated to {payload.status}"}



