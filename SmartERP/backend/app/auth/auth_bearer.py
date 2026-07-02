from fastapi.security import HTTPBearer
from fastapi.security.http import HTTPAuthorizationCredentials
from fastapi import Request, HTTPException


class JWTBearer(HTTPBearer):

    async def __call__(self, request: Request):

        credentials: HTTPAuthorizationCredentials = await super().__call__(request)

        if credentials:

            if credentials.scheme != "Bearer":
                raise HTTPException(
                    status_code=403,
                    detail="Invalid authentication scheme"
                )

            return credentials.credentials

        raise HTTPException(
            status_code=403,
            detail="Invalid authorization code"
        )