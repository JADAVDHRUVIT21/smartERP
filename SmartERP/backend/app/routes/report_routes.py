from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.session import get_db

from app.models.product import Product
from app.models.customer import Customer
from app.models.supplier import Supplier
from app.models.purchase import Purchase
from app.models.sale import Sale
from app.models.stock import Stock

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.get("/")
def get_reports(db: Session = Depends(get_db)):
    try:
        total_products = db.query(Product).count()

        total_customers = db.query(Customer).count()

        total_suppliers = db.query(Supplier).count()

        total_purchase = db.query(
            func.coalesce(func.sum(Purchase.total_amount), 0)
        ).scalar()

        total_sale = db.query(
            func.coalesce(func.sum(Sale.total_amount), 0)
        ).scalar()

        total_stock = db.query(
            func.coalesce(func.sum(Stock.available_qty), 0)
        ).scalar()

        return {
            "total_products": total_products,
            "total_customers": total_customers,
            "total_suppliers": total_suppliers,
            "total_purchase": float(total_purchase),
            "total_sale": float(total_sale),
            "total_stock": int(total_stock),
            "profit": float(total_sale) - float(total_purchase),
        }

    except Exception as e:
        return {
            "error": str(e)
        }