from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.db import engine
from app.database.base import Base

from app.models.user import User
from app.models.company import Company
from app.models.ledger import Ledger
from app.models.product import Product
from app.models.purchase import Purchase
from app.models.sale import Sale
from app.models.stock import Stock
from app.models.customer import Customer
from app.models.supplier import Supplier
from app.models.invoice import Invoice

from app.routes.user_routes import router as user_router
from app.routes.company_routes import router as company_router
from app.routes.ledger_routes import router as ledger_router
from app.routes.product_routes import router as product_router
from app.routes.purchase_routes import router as purchase_router
from app.routes.sale_routes import router as sale_router
from app.routes.stock_routes import router as stock_router
from app.routes.customer_routes import router as customer_router
from app.routes.supplier_routes import router as supplier_router
from app.routes.invoice_routes import router as invoice_router
from app.routes.dashboard_routes import router as dashboard_router
from app.routes.report_routes import router as report_router
from app.auth.auth_routes import router as auth_router

app = FastAPI(title="SmartERP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://smart-erp-navy.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(user_router)
app.include_router(company_router)
app.include_router(ledger_router)
app.include_router(product_router)
app.include_router(purchase_router)
app.include_router(sale_router)
app.include_router(stock_router)
app.include_router(customer_router)
app.include_router(supplier_router)
app.include_router(invoice_router)
app.include_router(dashboard_router)
app.include_router(auth_router)
app.include_router(report_router)

@app.get("/")
def home():
    return {"message": "SmartERP Running"}