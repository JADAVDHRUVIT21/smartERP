from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.product import Product
from app.schemas.product_schema import ProductCreate


router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


# -----------------------------
# Get All Products
# -----------------------------
@router.get("/")
def get_products(db: Session = Depends(get_db)):

    return db.query(Product).order_by(Product.id.desc()).all()



# -----------------------------
# Get Single Product
# -----------------------------
@router.get("/{product_id}")
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()


    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )


    return product



# -----------------------------
# Create Product
# -----------------------------
@router.post("/")
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db)
):

    # convert empty barcode to NULL
    barcode = product.barcode if product.barcode else None


    # check product code duplicate

    existing_code = db.query(Product).filter(
        Product.product_code == product.product_code
    ).first()


    if existing_code:

        raise HTTPException(
            status_code=400,
            detail="Product Code already exists"
        )



    # check barcode duplicate only if barcode exists

    if barcode:

        existing_barcode = db.query(Product).filter(
            Product.barcode == barcode
        ).first()


        if existing_barcode:

            raise HTTPException(
                status_code=400,
                detail="Barcode already exists"
            )



    new_product = Product(

        name = product.product_name,

        product_code = product.product_code,

        barcode = barcode,

        category = product.category,

        brand = product.brand,

        hsn_code = product.hsn_code,

        gst = product.gst,

        unit = product.unit,

        purchase_price = product.purchase_price,

        selling_price = product.selling_price,

        opening_stock = product.opening_stock,

        minimum_stock = product.minimum_stock,

        stock_quantity = product.stock_quantity,

        warehouse = product.warehouse,

        description = product.description,

        status = product.status
    )



    db.add(new_product)

    db.commit()

    db.refresh(new_product)



    return {

        "message":"Product Created Successfully",

        "product":new_product

    }




# -----------------------------
# Update Product
# -----------------------------
@router.put("/{product_id}")
def update_product(

    product_id:int,

    product:ProductCreate,

    db:Session = Depends(get_db)

):


    db_product = db.query(Product).filter(
        Product.id == product_id
    ).first()



    if not db_product:

        raise HTTPException(

            status_code=404,

            detail="Product not found"

        )



    barcode = product.barcode if product.barcode else None



    db_product.name = product.product_name

    db_product.product_code = product.product_code

    db_product.barcode = barcode

    db_product.category = product.category

    db_product.brand = product.brand

    db_product.hsn_code = product.hsn_code

    db_product.gst = product.gst

    db_product.unit = product.unit

    db_product.purchase_price = product.purchase_price

    db_product.selling_price = product.selling_price

    db_product.opening_stock = product.opening_stock

    db_product.minimum_stock = product.minimum_stock

    db_product.stock_quantity = product.stock_quantity

    db_product.warehouse = product.warehouse

    db_product.description = product.description

    db_product.status = product.status



    db.commit()

    db.refresh(db_product)



    return {

        "message":"Product Updated Successfully",

        "product":db_product

    }




# -----------------------------
# Delete Product
# -----------------------------
@router.delete("/{product_id}")
def delete_product(

    product_id:int,

    db:Session = Depends(get_db)

):


    product = db.query(Product).filter(
        Product.id == product_id
    ).first()



    if not product:

        raise HTTPException(

            status_code=404,

            detail="Product not found"

        )



    db.delete(product)

    db.commit()



    return {

        "message":"Product Deleted Successfully"

    }