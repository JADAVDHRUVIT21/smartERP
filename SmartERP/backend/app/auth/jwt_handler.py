from jose import jwt

SECRET_KEY = "smart_erp_secret_key"
ALGORITHM = "HS256"

def create_access_token(data: dict):
    token = jwt.encode(
        data,
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    return token