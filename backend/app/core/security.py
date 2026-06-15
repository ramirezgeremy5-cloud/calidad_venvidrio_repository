from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta

# =========================
# CONFIG
# =========================
SECRET_KEY = "venvidrio_super_secret_key_2026"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# =========================
# HASH PASSWORD
# =========================
def hash_password(password: str):
    return pwd_context.hash(password)

# =========================
# VERIFY PASSWORD
# =========================
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# =========================
# CREATE JWT TOKEN
# =========================
def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)