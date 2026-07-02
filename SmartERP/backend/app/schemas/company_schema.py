from pydantic import BaseModel

class CompanyCreate(BaseModel):
    company_name: str
    owner_name: str
    email: str
    phone: str
    address: str
    gst_number: str | None = None