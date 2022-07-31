from pymongo import MongoClient
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

# CORS
origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000"
]

# MongoDB connection
mongoClient = MongoClient("mongodb+srv://tural:hidraC137@cluster0.vlwau.mongodb.net/?retryWrites=true&w=majority")
db = mongoClient.react_mongodb_python_social_media

# Tokens
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")