from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str   # email
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str