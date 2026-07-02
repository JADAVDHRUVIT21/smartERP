from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import traceback

from app.database.session import get_db
from app.models.purchase import Purchase
from app.models.stock import Stock
from app.schemas.purchase_schema import PurchaseCreate

router = APIRouter(
    prefix="/purchases",
    tags=["Purchases"]
)


# ==========================
# CREATE PURCHASE
# ==========================
@router.post("/")
def create_purchase(
    purchase: PurchaseCreate,
    db: Session = Depends(get_db)
):
    try:

        new_purchase = Purchase(
            supplier_name=purchase.supplier_name,
            product_name=purchase.product_name,
            invoice_no=purchase.invoice_no,
            invoice_date=purchase.invoice_date,
            quantity=purchase.quantity,
            purchase_price=purchase.purchase_price,
            gst=purchase.gst,
            discount=purchase.discount,
            total_amount=purchase.total_amount
        )

        db.add(new_purchase)

        stock = db.query(Stock).filter(
            Stock.product_name == purchase.product_name
        ).first()

        if stock:
            stock.purchase_qty += purchase.quantity
            stock.available_qty += purchase.quantity
        else:
            stock = Stock(
                product_name=purchase.product_name,
                purchase_qty=purchase.quantity,
                sale_qty=0,
                available_qty=purchase.quantity
            )
            db.add(stock)

        db.commit()
        db.refresh(new_purchase)

        return {
            "message": "Purchase Added Successfully",
            "data": new_purchase
        }

    except Exception as e:
        db.rollback()
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ==========================
# GET ALL PURCHASES
# ==========================
@router.get("/")
def get_purchases(
    db: Session = Depends(get_db)
):
    return db.query(Purchase).order_by(
        Purchase.id.desc()
    ).all()


# ==========================
# GET SINGLE PURCHASE
# ==========================
@router.get("/{purchase_id}")
def get_purchase(
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

    return purchase


# ==========================
# UPDATE PURCHASE
# ==========================
@router.put("/{purchase_id}")
def update_purchase(
    purchase_id: int,
    purchase: PurchaseCreate,
    db: Session = Depends(get_db)
):

    existing = db.query(Purchase).filter(
        Purchase.id == purchase_id
    ).first()

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Purchase not found"
        )

    try:

        # Remove old quantity from stock
        stock = db.query(Stock).filter(
            Stock.product_name == existing.product_name
        ).first()

        if stock:
            stock.purchase_qty -= existing.quantity
            stock.available_qty -= existing.quantity

        # Update purchase
        existing.supplier_name = purchase.supplier_name
        existing.product_name = purchase.product_name
        existing.invoice_no = purchase.invoice_no
        existing.invoice_date = purchase.invoice_date
        existing.quantity = purchase.quantity
        existing.purchase_price = purchase.purchase_price
        existing.gst = purchase.gst
        existing.discount = purchase.discount
        existing.total_amount = purchase.total_amount

        # Add new quantity to stock
        stock = db.query(Stock).filter(
            Stock.product_name == purchase.product_name
        ).first()

        if stock:
            stock.purchase_qty += purchase.quantity
            stock.available_qty += purchase.quantity
        else:
            stock = Stock(
                product_name=purchase.product_name,
                purchase_qty=purchase.quantity,
                sale_qty=0,
                available_qty=purchase.quantity
            )
            db.add(stock)

        db.commit()
        db.refresh(existing)

        return {
            "message": "Purchase Updated Successfully",
            "data": existing
        }

    except Exception as e:
        db.rollback()
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ==========================
# DELETE PURCHASE
# ==========================
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

    try:

        stock = db.query(Stock).filter(
            Stock.product_name == purchase.product_name
        ).first()

        if stock:
            stock.purchase_qty -= purchase.quantity
            stock.available_qty -= purchase.quantity

        db.delete(purchase)
        db.commit()

        return {
            "message": "Purchase Deleted Successfully"
        }

    except Exception as e:
        db.rollback()
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )