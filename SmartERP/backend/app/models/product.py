from sqlalchemy import Column, Integer, String, Float, Boolean
from app.database.base import Base


class Product(Base):

    __tablename__ = "products"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    name = Column(
        String,
        nullable=False
    )


    product_code = Column(
        String,
        unique=True,
        nullable=False
    )


    barcode = Column(
        String,
        unique=True,
        nullable=True
    )


    category = Column(String)


    brand = Column(String)


    hsn_code = Column(String)


    gst = Column(
        Float,
        default=18
    )


    unit = Column(String)


    purchase_price = Column(
        Float,
        default=0
    )


    selling_price = Column(
        Float,
        default=0
    )


    opening_stock = Column(
        Integer,
        default=0
    )


    minimum_stock = Column(
        Integer,
        default=0
    )


    stock_quantity = Column(
        Integer,
        default=0
    )


    warehouse = Column(String)


    description = Column(String)


    status = Column(
        Boolean,
        default=True
    )