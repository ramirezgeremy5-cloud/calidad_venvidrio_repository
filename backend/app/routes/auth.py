from fastapi import APIRouter, HTTPException
from sqlalchemy import text

from app.database.connection import engine
from app.core.security import verify_password, create_access_token
from app.schemas.auth import LoginRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["Auth"])

# =========================
# LOGIN
# =========================
@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest):

    with engine.connect() as conn:

        user = conn.execute(
            text("""
                SELECT id, nombre, email, password, rol
                FROM usuarios
                WHERE email = :email
            """),
            {"email": data.username}
        ).mappings().first()

        # usuario no existe
        if not user:
            raise HTTPException(status_code=401, detail="Usuario no encontrado")

        # password incorrecta
        if not verify_password(data.password, user["password"]):
            raise HTTPException(status_code=401, detail="Contraseña incorrecta")

        # crear token
        token = create_access_token({
            "sub": user["email"],
            "role": user["rol"]
        })

        return {
            "access_token": token,
            "role": user["rol"]
        }