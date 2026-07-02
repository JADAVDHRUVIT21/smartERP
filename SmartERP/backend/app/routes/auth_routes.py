from fastapi import APIRouter, HTTPException

from app.auth.jwt_handler import create_access_token
from app.schemas.login_schema import LoginRequest

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/login")
def login(data: LoginRequest):

    if data.username != "admin" or data.password != "admin123":
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    token = create_access_token(
        {"user": data.username}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }