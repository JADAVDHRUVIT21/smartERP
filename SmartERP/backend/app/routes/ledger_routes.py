from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.purchase import Purchase
from app.models.sale import Sale

router = APIRouter(
    prefix="/ledger",
    tags=["Ledger"]
)


@router.get("/")
def get_ledger(db: Session = Depends(get_db)):
    ledger = []

    # Fetch all purchases
    purchases = db.query(Purchase).all()
    print("Purchases Found:", len(purchases))

    for p in purchases:
        ledger.append({
            "date": p.invoice_date,
            "type": "Purchase",
            "party": p.supplier_name,
            "invoice": p.invoice_no,
            "debit": float(p.total_amount),
            "credit": 0
        })

    # Fetch all sales
    sales = db.query(Sale).all()
    print("Sales Found:", len(sales))

    for s in sales:
        ledger.append({
            "date": s.invoice_date,
            "type": "Sale",
            "party": s.customer_name,
            "invoice": s.invoice_no,
            "debit": 0,
            "credit": float(s.total_amount)
        })

    # Sort by date
    ledger.sort(key=lambda x: x["date"])

    print("Ledger Data:", ledger)

    return ledger