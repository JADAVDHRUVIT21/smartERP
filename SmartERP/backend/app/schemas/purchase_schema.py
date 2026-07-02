from pydantic import BaseModel


class PurchaseCreate(BaseModel):

    supplier_name: str

    product_name: str

    invoice_no: str

    invoice_date: str

    quantity: int

    purchase_price: float

    gst: float = 18

    discount: float = 0

    total_amount: float