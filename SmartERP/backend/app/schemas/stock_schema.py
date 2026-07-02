from pydantic import BaseModel


class StockCreate(BaseModel):
    product_name: str
    purchase_qty: int = 0
    sale_qty: int = 0


class StockResponse(BaseModel):
    id: int
    product_name: str
    purchase_qty: int
    sale_qty: int
    available_qty: int

    class Config:
        from_attributes = True