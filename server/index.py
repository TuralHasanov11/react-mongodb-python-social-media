from math import ceil
from typing import Union, Optional
from fastapi import FastAPI, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel, EmailStr, BaseSettings
from fastapi.responses import JSONResponse
from pymongo import MongoClient
from bson.objectid import ObjectId

app = FastAPI()

# ---- CORS ----
origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# MongoDB connection
mongoClient = MongoClient("")
db = mongoClient.test_database

# Request Data Models
class RegisterData(BaseModel):
  firstName: str = ''
  lastName: str = ''
  email: EmailStr = ''
  password: str = ''
  confirmPassword: str = ''

class LoginData(BaseModel):
  email: EmailStr = ''
  password: str = ''

class PostCreateUpdateData(BaseModel):
  title: str = ''
  message: str = ''
  tags: list = []
  selectedFile: str = ''
  username: str = ''

class CommentData(BaseModel):
  comment: str
  
# Endpoints  
@app.get("/posts")
def getPosts(page: Optional[int] = Query(1)):
  try:
    limit = 10
    startIndex = (page-1)*limit

    posts = db.posts.find().skip(startIndex).limit(limit)
    total = db.posts.count_documents({})

    return JSONResponse(content = { "data": posts, "currentPage": page, "numberOfPages": ceil(total / limit)})
  except Exception as e:
    return JSONResponse(status=400, content = e)

@app.get("/posts/{post_id}")
def getPost(post_id:str):
  try:
    post = db.posts.find_one({'_id': ObjectId(post_id)})

    return post
  except Exception as e:
    return JSONResponse(status=400, content = e)

@app.get("/posts/creator")
def getPostsByCreator(username: str, page: Optional[int] = Query(1)):
  try:
    limit = 10
    posts = db.posts.find({ "username": username})
    total = db.posts.count_documents({ "username": username})

    return JSONResponse(content = { "data": posts, "currentPage": page, "numberOfPages": ceil(total / limit)})
  except Exception as e:
    return JSONResponse(status=400, content = e)

@app.get("/posts/search")
def getPostsBySearch(searchQuery: Optional[str]=Query(None), tags: Optional[str] = Query(None), page: Optional[int] = Query(1)):
  try:
    limit = 10
    startIndex = (page-1)*limit

    tags = tags.split(',')

    posts = db.posts.find({ "$or": [{"title":{ "$regex": searchQuery, "$options": 'i' }}, {"tags": {"$in": tags}}]}).skip(startIndex).limit(limit)
    total = db.posts.count_documents({ "$or": [{"title":{ "$regex": searchQuery, "$options": 'i' }}, {"tags": {"$in": tags}}]})

    return JSONResponse(content = { "data": posts, "currentPage": page, "numberOfPages": ceil(total / limit)})
  except Exception as e:
    return JSONResponse(status=400, content = e)

@app.post("/posts")
def createPost(data: PostCreateUpdateData):
  try:
    posts = db.posts
    post = posts.insert_one(data)

    return post
  except Exception as e:
    return JSONResponse(status=400, content = e)

@app.patch("/posts/{post_id}/like")
def likePost(post_id: str):
  return {"Hello": "World"}

@app.post("/posts/{post_id}/comments")
def commentPost(post_id: str, data: CommentData):
  return {"Hello": "World"}

@app.patch("/posts/{post_id}")
def updatePost(post_id: str, data: PostCreateUpdateData):
  return {"Hello": "World"}

@app.delete("/posts/{post_id}")
def deletePost(post_id: str):
  return {"Hello": "World"}

@app.post("/auth/login")
def login(data: LoginData):
  return {"Hello": "World"}

@app.post("/auth/register")
def register(data: RegisterData):
  return {"Hello": "World"}