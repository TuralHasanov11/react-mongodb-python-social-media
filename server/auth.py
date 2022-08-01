from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from pydantic import BaseModel
from fastapi import Depends, HTTPException
from jose import JWTError, jwt
from config import oauth2_scheme
from config import db
from schemas import user_serializer
from models import User
from bson.objectid import ObjectId
from config import SECRET_KEY

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 24*60

class TokenData(BaseModel):
  id: str | None = None

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def getAuthUser(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id: str = payload.get("id")
        
        if id is None:
            raise credentials_exception
        token_data = TokenData(id=id)
    except JWTError as e:
        raise credentials_exception
    user = getUser(id=token_data.id)
    if user is None:
        raise credentials_exception
    return User(**user)

def getUser(id: str):
  user = db.users.find_one({"_id": ObjectId(id)})
  return user_serializer(user)