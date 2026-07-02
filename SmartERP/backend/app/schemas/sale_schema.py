from pydantic import BaseModel


class SaleCreate(BaseModel):
    customer_name: str

    product_name: str

    invoice_no: str

    invoice_date: str

    quantity: int

    selling_price: float

    gst: float = 18

    discount: float = 0

    payment_type: str = "CASH"

    paid_amount: float