from pymongo import MongoClient
from fastapi.security import OAuth2PasswordBearer
import base64
from pydantic import BaseSettings

class Settings(BaseSettings):
    mongodb_url: str = ""
    app_url: str = ""
    secret_key: str = ""

    class Config:
        env_file = ".env"

SECRET_KEY = base64.b64decode(Settings().secret_key)

# CORS
origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000"
]

# MongoDB connection
mongoClient = MongoClient(Settings().mongodb_url)
db = mongoClient.react_mongodb_python_social_media

# Tokens
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

settings = Settings()