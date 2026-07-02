from sqlalchemy import Column, Integer, String, Float
from app.database.base import Base


class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)

    customer_name = Column(String, nullable=False)
    product_name = Column(String, nullable=False)

    invoice_no = Column(String, nullable=False)
    invoice_date = Column(String, nullable=False)

    quantity = Column(Integer, nullable=False)

    selling_price = Column(Float, nullable=False)

    gst = Column(Float, default=18)

    discount = Column(Float, default=0)

    total_amount = Column(Float, nullable=False)

    payment_type = Column(String, default="CASH")

    paid_amount = Column(Float, default=0)

    due_amount = Column(Float, default=0)