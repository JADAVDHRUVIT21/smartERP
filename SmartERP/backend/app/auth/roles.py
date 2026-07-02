from fastapi import HTTPException

def require_admin(role: str):

    if role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )