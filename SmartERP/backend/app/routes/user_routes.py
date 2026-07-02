from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.user_schema import UserCreate
from app.models.user import User
from app.database.db import SessionLocal
from app.utils.security import hash_password
from app.schemas.login_schema import LoginRequest
from app.utils.security import verify_password
from fastapi import HTTPException
from app.utils.jwt_handler import create_access_token

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    
    new_user = User(
    full_name=user.full_name,
    email=user.email,
    password=hash_password(user.password)
)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User Registered Successfully",
        "user_id": new_user.id
    }

@router.post("/login")
def login(user: LoginRequest, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Email"
        )

    if not verify_password(
        user.password,
        db_user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid Password"
        )


    token = create_access_token({
    "user_id": db_user.id,
    "email": db_user.email
    })

    return {
    "message": "Login Successful",
    "access_token": token,
    "token_type": "bearer"
    }