from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.session import get_db
from app.models.purchase import Purchase
from app.models.sale import Sale
from app.models.customer import Customer
from app.models.supplier import Supplier
from app.models.product import Product
from app.models.stock import Stock

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/finance")
def dashboard(db: Session = Depends(get_db)):

    total_purchase = (
        db.query(func.sum(Purchase.total_amount)).scalar()
        or 0
    )

    total_sale = (
        db.query(func.sum(Sale.total_amount)).scalar()
        or 0
    )

    total_customers = db.query(Customer).count()

    total_suppliers = db.query(Supplier).count()

    total_products = db.query(Product).count()

    stock_items = db.query(Stock).count()

    profit = total_sale - total_purchase

    return {
        "purchase": total_purchase,
        "sales": total_sale,
        "profit": profit,
        "customers": total_customers,
        "suppliers": total_suppliers,
        "products": total_products,
        "stock": stock_items
    }