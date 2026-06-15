from fastapi import FastAPI
from sqlalchemy import text

from app.database.connection import engine, Base
from app.routes import usuarios

app = FastAPI()

# crear tablas
Base.metadata.create_all(bind=engine)

# rutas
app.include_router(usuarios.router)


@app.get("/")
def home():
    return {"status": "ok"}


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