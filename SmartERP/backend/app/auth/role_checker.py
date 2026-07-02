from fastapi import HTTPException

def check_admin(role):
    if role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Access Denied"
        )