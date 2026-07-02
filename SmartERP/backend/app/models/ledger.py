from sqlalchemy import Column, Integer, String
from app.database.base import Base

class Ledger(Base):
    __tablename__ = "ledgers"

    id = Column(Integer, primary_key=True, index=True)
    ledger_name = Column(String, nullable=False)
    ledger_type = Column(String, nullable=False)
    opening_balance = Column(String, nullable=False)