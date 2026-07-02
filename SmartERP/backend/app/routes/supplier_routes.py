from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.supplier_schema import SupplierCreate
from app.models.supplier import Supplier

router = APIRouter(
    prefix="/suppliers",
    tags=["Suppliers"]
)

@router.get("/")
def get_suppliers(db: Session = Depends(get_db)):
    return db.query(Supplier).all()

@router.get("/{supplier_id}")
def get_supplier(
    supplier_id: int,
    db: Session = Depends(get_db)
):
    supplier = (
        db.query(Supplier)
        .filter(Supplier.id == supplier_id)
        .first()
    )

    if not supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    return supplier

@router.post("/")
def create_supplier(
    supplier: SupplierCreate,
    db: Session = Depends(get_db)
):
    new_supplier = Supplier(
        name=supplier.name,
        phone=supplier.phone,
        email=supplier.email,
        address=supplier.address
    )

    db.add(new_supplier)
    db.commit()
    db.refresh(new_supplier)

    return {
        "message": "Supplier created successfully",
        "id": new_supplier.id
    }

@router.put("/{supplier_id}")
def update_supplier(
    supplier_id: int,
    supplier: SupplierCreate,
    db: Session = Depends(get_db)
):
    existing_supplier = (
        db.query(Supplier)
        .filter(Supplier.id == supplier_id)
        .first()
    )

    if not existing_supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    existing_supplier.name = supplier.name
    existing_supplier.phone = supplier.phone
    existing_supplier.email = supplier.email
    existing_supplier.address = supplier.address

    db.commit()
    db.refresh(existing_supplier)

    return {
        "message": "Supplier updated successfully"
    }

@router.delete("/{supplier_id}")
def delete_supplier(
    supplier_id: int,
    db: Session = Depends(get_db)
):
    supplier = (
        db.query(Supplier)
        .filter(Supplier.id == supplier_id)
        .first()
    )

    if not supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    db.delete(supplier)
    db.commit()

    return {
        "message": "Supplier deleted successfully"
    }