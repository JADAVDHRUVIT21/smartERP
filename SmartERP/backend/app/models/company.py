from sqlalchemy import Column, Integer, String
from app.database.base import Base

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, nullable=False)
    owner_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    address = Column(String, nullable=False)
    gst_number = Column(String, nullable=True)