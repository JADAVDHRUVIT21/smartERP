from pydantic import BaseModel

class LedgerCreate(BaseModel):
    ledger_name: str
    ledger_type: str
    opening_balance: str