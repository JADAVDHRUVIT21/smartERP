from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.customer import Customer
from app.schemas.customer_schema import CustomerCreate
from app.auth.auth_bearer import JWTBearer

router = APIRouter(
    prefix="/customers",
    tags=["Customers"],
    dependencies=[Depends(JWTBearer())]
)

# =========================
# GET ALL CUSTOMERS
# =========================
@router.get("/")
def get_customers(db: Session = Depends(get_db)):
    return db.query(Customer).all()


# =========================
# GET CUSTOMER BY ID
# =========================
@router.get("/{customer_id}")
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = (
        db.query(Customer)
        .filter(Customer.id == customer_id)
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    return customer


# =========================
# CREATE CUSTOMER
# =========================
@router.post("/")
def create_customer(
    customer: CustomerCreate,
    db: Session = Depends(get_db)
):
    new_customer = Customer(
        customer_name=customer.customer_name,
        phone=customer.phone,
        email=customer.email,
        address=customer.address
    )

    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)

    return {
        "message": "Customer created successfully",
        "id": new_customer.id
    }


# =========================
# UPDATE CUSTOMER
# =========================
@router.put("/{customer_id}")
def update_customer(
    customer_id: int,
    customer: CustomerCreate,
    db: Session = Depends(get_db)
):
    existing_customer = (
        db.query(Customer)
        .filter(Customer.id == customer_id)
        .first()
    )

    if not existing_customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    existing_customer.customer_name = customer.customer_name
    existing_customer.phone = customer.phone
    existing_customer.email = customer.email
    existing_customer.address = customer.address

    db.commit()
    db.refresh(existing_customer)

    return {
        "message": "Customer updated successfully"
    }


# =========================
# DELETE CUSTOMER
# =========================
@router.delete("/{customer_id}")
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db)
):
    customer = (
        db.query(Customer)
        .filter(Customer.id == customer_id)
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    db.delete(customer)
    db.commit()

    return {
        "message": "Customer deleted successfully"
    }