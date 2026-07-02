from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.invoice import Invoice
from app.schemas.invoice_schema import InvoiceCreate

router = APIRouter(
    prefix="/invoices",
    tags=["Invoices"]
)


@router.get("/")
def get_invoices(db: Session = Depends(get_db)):
    return db.query(Invoice).all()


@router.get("/{invoice_id}")
def get_invoice(
    invoice_id: int,
    db: Session = Depends(get_db)
):
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id
    ).first()

    if not invoice:
        raise HTTPException(
            status_code=404,
            detail="Invoice not found"
        )

    return invoice


@router.post("/")
def create_invoice(
    invoice: InvoiceCreate,
    db: Session = Depends(get_db)
):
    total_amount = invoice.quantity * invoice.price

    new_invoice = Invoice(
        invoice_no=invoice.invoice_no,
        invoice_date=invoice.invoice_date,
        customer_name=invoice.customer_name,
        product_name=invoice.product_name,
        quantity=invoice.quantity,
        price=invoice.price,
        total_amount=total_amount
    )

    db.add(new_invoice)
    db.commit()
    db.refresh(new_invoice)

    return {
        "message": "Invoice created successfully",
        "invoice_id": new_invoice.id,
        "total_amount": total_amount
    }


@router.put("/{invoice_id}")
def update_invoice(
    invoice_id: int,
    invoice: InvoiceCreate,
    db: Session = Depends(get_db)
):
    existing_invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id
    ).first()

    if not existing_invoice:
        raise HTTPException(
            status_code=404,
            detail="Invoice not found"
        )

    existing_invoice.invoice_no = invoice.invoice_no
    existing_invoice.invoice_date = invoice.invoice_date
    existing_invoice.customer_name = invoice.customer_name
    existing_invoice.product_name = invoice.product_name
    existing_invoice.quantity = invoice.quantity
    existing_invoice.price = invoice.price
    existing_invoice.total_amount = (
        invoice.quantity * invoice.price
    )

    db.commit()
    db.refresh(existing_invoice)

    return {
        "message": "Invoice updated successfully",
        "invoice": existing_invoice
    }


@router.delete("/{invoice_id}")
def delete_invoice(
    invoice_id: int,
    db: Session = Depends(get_db)
):
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id
    ).first()

    if not invoice:
        raise HTTPException(
            status_code=404,
            detail="Invoice not found"
        )

    db.delete(invoice)
    db.commit()

    return {
        "message": "Invoice deleted successfully"
    }