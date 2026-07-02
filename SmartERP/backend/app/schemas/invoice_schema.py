from pydantic import BaseModel


class InvoiceCreate(BaseModel):
    invoice_no: str
    invoice_date: str
    customer_name: str
    product_name: str
    quantity: int
    price: float