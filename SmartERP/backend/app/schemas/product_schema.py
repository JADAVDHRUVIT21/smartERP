from pydantic import BaseModel


class ProductCreate(BaseModel):

    product_name: str

    product_code: str


    barcode: str | None = None


    category: str | None = None


    brand: str | None = None


    hsn_code: str | None = None


    gst: float = 18


    unit: str


    purchase_price: float = 0


    selling_price: float = 0


    opening_stock: int = 0


    minimum_stock: int = 0


    stock_quantity: int = 0


    warehouse: str | None = None


    description: str | None = None


    status: bool = True



class ProductResponse(ProductCreate):

    id:int


    class Config:

        from_attributes = True