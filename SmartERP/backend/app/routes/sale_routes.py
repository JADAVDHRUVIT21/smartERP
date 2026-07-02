from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.sale import Sale
from app.models.stock import Stock
from app.schemas.sale_schema import SaleCreate

router = APIRouter(
    prefix="/sales",
    tags=["Sales"]
)


# ==========================
# CREATE SALE
# ==========================
@router.post("/")
def create_sale(
    sale: SaleCreate,
    db: Session = Depends(get_db)
):

    stock = db.query(Stock).filter(
        Stock.product_name == sale.product_name
    ).first()

    if not stock:
        raise HTTPException(
            status_code=400,
            detail="Product stock not found"
        )

    if stock.available_qty < sale.quantity:
        raise HTTPException(
            status_code=400,
            detail="Insufficient stock"
        )

    if sale.quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than zero"
        )

    if sale.selling_price <= 0:
        raise HTTPException(
            status_code=400,
            detail="Selling price must be greater than zero"
        )

    subtotal = sale.quantity * sale.selling_price

    gst_amount = subtotal * sale.gst / 100

    total_amount = subtotal + gst_amount - sale.discount

    due_amount = total_amount - sale.paid_amount

    if due_amount < 0:
        raise HTTPException(
            status_code=400,
            detail="Paid amount cannot exceed Total Amount"
        )

    new_sale = Sale(
        customer_name=sale.customer_name,
        product_name=sale.product_name,
        invoice_no=sale.invoice_no,
        invoice_date=sale.invoice_date,
        quantity=sale.quantity,
        selling_price=sale.selling_price,
        gst=sale.gst,
        discount=sale.discount,
        total_amount=total_amount,
        payment_type=sale.payment_type,
        paid_amount=sale.paid_amount,
        due_amount=due_amount
    )

    db.add(new_sale)

    stock.sale_qty += sale.quantity
    stock.available_qty -= sale.quantity

    db.commit()
    db.refresh(new_sale)

    return {
        "message": "Sale Created Successfully",
        "sale": new_sale
    }


# ==========================
# GET ALL SALES
# ==========================
@router.get("/")
def get_sales(db: Session = Depends(get_db)):
    return db.query(Sale).all()


# ==========================
# GET SALE BY ID
# ==========================
@router.get("/{sale_id}")
def get_sale(
    sale_id: int,
    db: Session = Depends(get_db)
):

    sale = db.query(Sale).filter(
        Sale.id == sale_id
    ).first()

    if not sale:
        raise HTTPException(
            status_code=404,
            detail="Sale not found"
        )

    return sale


# ==========================
# UPDATE SALE
# ==========================
@router.put("/{sale_id}")
def update_sale(
    sale_id: int,
    sale: SaleCreate,
    db: Session = Depends(get_db)
):

    existing_sale = db.query(Sale).filter(
        Sale.id == sale_id
    ).first()

    if not existing_sale:
        raise HTTPException(
            status_code=404,
            detail="Sale not found"
        )

    stock = db.query(Stock).filter(
        Stock.product_name == existing_sale.product_name
    ).first()

    if stock:

        stock.sale_qty -= existing_sale.quantity
        stock.available_qty += existing_sale.quantity

        if stock.available_qty < sale.quantity:
            raise HTTPException(
                status_code=400,
                detail="Insufficient stock"
            )

        stock.sale_qty += sale.quantity
        stock.available_qty -= sale.quantity

    subtotal = sale.quantity * sale.selling_price

    gst_amount = subtotal * sale.gst / 100

    total_amount = subtotal + gst_amount - sale.discount

    due_amount = total_amount - sale.paid_amount

    if due_amount < 0:
        raise HTTPException(
            status_code=400,
            detail="Paid amount cannot exceed Total Amount"
        )

    existing_sale.customer_name = sale.customer_name
    existing_sale.product_name = sale.product_name
    existing_sale.invoice_no = sale.invoice_no
    existing_sale.invoice_date = sale.invoice_date
    existing_sale.quantity = sale.quantity
    existing_sale.selling_price = sale.selling_price
    existing_sale.gst = sale.gst
    existing_sale.discount = sale.discount
    existing_sale.total_amount = total_amount
    existing_sale.payment_type = sale.payment_type
    existing_sale.paid_amount = sale.paid_amount
    existing_sale.due_amount = due_amount

    db.commit()
    db.refresh(existing_sale)

    return {
        "message": "Sale Updated Successfully",
        "sale": existing_sale
    }


# ==========================
# DELETE SALE
# ==========================
@router.delete("/{sale_id}")
def delete_sale(
    sale_id: int,
    db: Session = Depends(get_db)
):

    sale = db.query(Sale).filter(
        Sale.id == sale_id
    ).first()

    if not sale:
        raise HTTPException(
            status_code=404,
            detail="Sale not found"
        )

    stock = db.query(Stock).filter(
        Stock.product_name == sale.product_name
    ).first()

    if stock:
        stock.sale_qty -= sale.quantity
        stock.available_qty += sale.quantity

    db.delete(sale)
    db.commit()

    return {
        "message": "Sale Deleted Successfully"
    }