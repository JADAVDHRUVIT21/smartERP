from sqlalchemy import Column, Integer, String, Float
from app.database.base import Base


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)

    invoice_no = Column(String, nullable=False)

    invoice_date = Column(String, nullable=False)

    customer_name = Column(String, nullable=False)

    product_name = Column(String, nullable=False)

    quantity = Column(Integer, nullable=False)

    price = Column(Float, nullable=False)

    total_amount = Column(Float, nullable=False)