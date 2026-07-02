from sqlalchemy import Column, Integer, String, Float
from app.database.base import Base


class Purchase(Base):
    __tablename__ = "purchases"

    id = Column(Integer, primary_key=True, index=True)

    supplier_name = Column(String, nullable=False)

    product_name = Column(String, nullable=False)

    invoice_no = Column(String, nullable=False)

    invoice_date = Column(String, nullable=False)

    quantity = Column(Integer, nullable=False)

    purchase_price = Column(Float, nullable=False)

    gst = Column(Float, default=18)

    discount = Column(Float, default=0)

    total_amount = Column(Float, nullable=False)