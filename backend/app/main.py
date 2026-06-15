from fastapi import FastAPI
from sqlalchemy import text

from app.database.connection import engine, Base

# routers
from app.routes import usuarios
from app.routes import auth   # 👈 NUEVO

app = FastAPI(title="Venvidrio API")

# crear tablas
Base.metadata.create_all(bind=engine)

# =========================
# ROUTERS
# =========================
app.include_router(usuarios.router)
app.include_router(auth.router)   # 👈 LOGIN

# =========================
# HOME
# =========================
@app.get("/")
def home():
    return {
        "status": "ok",
        "service": "venvidrio_calidad"
    }

# =========================
# HEALTH CHECK DB
# =========================
@app.get("/health/db")
def health_db():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))

        return {
            "database": "venvidrio_calidad",
            "status": "connected"
        }

    except Exception as e:
        return {
            "status": "error",
            "detail": str(e)
        }