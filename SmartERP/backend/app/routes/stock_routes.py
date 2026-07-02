from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.stock import Stock
from app.models.purchase import Purchase
from app.schemas.purchase_schema import PurchaseCreate
from app.schemas.stock_schema import StockCreate

router = APIRouter(
    prefix="/stock",
    tags=["Stock"]
)


@router.get("/")
def get_stock(
    db: Session = Depends(get_db)
):
    return db.query(Stock).all()


@router.post("/")
def create_stock(
    stock: StockCreate,
    db: Session = Depends(get_db)
):
    available_qty = (
        stock.purchase_qty - stock.sale_qty
    )

    new_stock = Stock(
        product_name=stock.product_name,
        purchase_qty=stock.purchase_qty,
        sale_qty=stock.sale_qty,
        available_qty=available_qty
    )

    db.add(new_stock)
    db.commit()
    db.refresh(new_stock)

    return {
        "message": "Stock created",
        "id": new_stock.id
    }


@router.get("/{stock_id}")
def get_stock_by_id(
    stock_id: int,
    db: Session = Depends(get_db)
):
    stock = db.query(Stock).filter(
        Stock.id == stock_id
    ).first()

    if not stock:
        raise HTTPException(
            status_code=404,
            detail="Stock not found"
        )

    return stock


# UPDATE PURCHASE AND STOCK
@router.put("/{purchase_id}")
def update_purchase(
    purchase_id: int,
    purchase: PurchaseCreate,
    db: Session = Depends(get_db)
):
    existing_purchase = db.query(Purchase).filter(
        Purchase.id == purchase_id
    ).first()

    if not existing_purchase:
        raise HTTPException(
            status_code=404,
            detail="Purchase not found"
        )

    stock = db.query(Stock).filter(
        Stock.product_name == existing_purchase.product_name
    ).first()

    if stock:
        # Remove old quantity
        stock.purchase_qty -= existing_purchase.quantity
        stock.available_qty -= existing_purchase.quantity

        # Add new quantity
        stock.purchase_qty += purchase.quantity
        stock.available_qty += purchase.quantity

    existing_purchase.supplier_name = purchase.supplier_name
    existing_purchase.product_name = purchase.product_name
    existing_purchase.quantity = purchase.quantity
    existing_purchase.invoice_no = purchase.invoice_no
    existing_purchase.invoice_date = purchase.invoice_date
    existing_purchase.total_amount = purchase.total_amount

    db.commit()
    db.refresh(existing_purchase)

    return {
        "message": "Purchase updated successfully"
    }


# DELETE PURCHASE AND UPDATE STOCK
@router.delete("/{purchase_id}")
def delete_purchase(
    purchase_id: int,
    db: Session = Depends(get_db)
):
    purchase = db.query(Purchase).filter(
        Purchase.id == purchase_id
    ).first()

    if not purchase:
        raise HTTPException(
            status_code=404,
            detail="Purchase not found"
        )

    stock = db.query(Stock).filter(
        Stock.product_name == purchase.product_name
    ).first()

    if stock:
        stock.purchase_qty -= purchase.quantity
        stock.available_qty -= purchase.quantity

    db.delete(purchase)
    db.commit()

    return {
        "message": "Purchase deleted successfully"
    }