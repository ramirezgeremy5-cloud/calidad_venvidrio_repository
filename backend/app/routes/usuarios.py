from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.usuario import Usuario
from app.schema.usuario import UsuarioCreate

router = APIRouter()

# conexión a BD
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/usuarios")
def listar_usuarios(db: Session = Depends(get_db)):
    return db.query(Usuario).all()


@router.post("/usuarios")
def crear_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):

    # evitar duplicados
    existe = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if existe:
        raise HTTPException(status_code=400, detail="Email ya registrado")

    nuevo = Usuario(
        nombre=usuario.nombre,
        email=usuario.email,
        password=usuario.password,
        rol=usuario.rol
    )

    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)

    return nuevo