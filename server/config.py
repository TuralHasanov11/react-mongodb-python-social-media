from pymongo import MongoClient
from fastapi.security import OAuth2PasswordBearer
import base64
from pydantic import BaseSettings

class Settings(BaseSettings):
    mongodb_url: str = ""
    app_url: str = ""
    secret_key: str = ""
    client_url: str = ""

    class Config:
        env_file = ".env"

settings = Settings()

SECRET_KEY = base64.b64decode(settings.secret_key)

# CORS
origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
    settings.app_url,
    settings.client_url
]

# MongoDB connection
mongoClient = MongoClient(settings.mongodb_url)
db = mongoClient.react_mongodb_python_social_media

# Tokens
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

