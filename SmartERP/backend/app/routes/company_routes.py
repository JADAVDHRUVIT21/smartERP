from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import SessionLocal
from app.models.company import Company
from app.schemas.company_schema import CompanyCreate

router = APIRouter(
    prefix="/companies",
    tags=["Companies"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Create Company
@router.post("/")
def create_company(
    company: CompanyCreate,
    db: Session = Depends(get_db)
):
    new_company = Company(
        company_name=company.company_name,
        owner_name=company.owner_name,
        email=company.email,
        phone=company.phone,
        address=company.address,
        gst_number=company.gst_number
    )

    db.add(new_company)
    db.commit()
    db.refresh(new_company)

    return {
        "message": "Company Created Successfully",
        "company_id": new_company.id
    }


# Get All Companies
@router.get("/")
def get_companies(
    db: Session = Depends(get_db)
):
    return db.query(Company).all()


# Get Company By ID
@router.get("/{company_id}")
def get_company(
    company_id: int,
    db: Session = Depends(get_db)
):
    company = db.query(Company).filter(
        Company.id == company_id
    ).first()

    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company Not Found"
        )

    return company


# Update Company
@router.put("/{company_id}")
def update_company(
    company_id: int,
    company: CompanyCreate,
    db: Session = Depends(get_db)
):
    existing_company = db.query(Company).filter(
        Company.id == company_id
    ).first()

    if not existing_company:
        raise HTTPException(
            status_code=404,
            detail="Company Not Found"
        )

    existing_company.company_name = company.company_name
    existing_company.owner_name = company.owner_name
    existing_company.email = company.email
    existing_company.phone = company.phone
    existing_company.address = company.address
    existing_company.gst_number = company.gst_number

    db.commit()
    db.refresh(existing_company)

    return {
        "message": "Company Updated Successfully"
    }


# Delete Company
@router.delete("/{company_id}")
def delete_company(
    company_id: int,
    db: Session = Depends(get_db)
):
    company = db.query(Company).filter(
        Company.id == company_id
    ).first()

    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company Not Found"
        )

    db.delete(company)
    db.commit()

    return {
        "message": "Company Deleted Successfully"
    }