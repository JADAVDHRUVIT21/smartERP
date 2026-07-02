from sqlalchemy import Column, Integer, String
from app.database.base import Base


class Stock(Base):
    __tablename__ = "stocks"

    id = Column(Integer, primary_key=True, index=True)

    product_name = Column(String, unique=True, nullable=False)

    purchase_qty = Column(Integer, default=0)

    sale_qty = Column(Integer, default=0)

    available_qty = Column(Integer, default=0)