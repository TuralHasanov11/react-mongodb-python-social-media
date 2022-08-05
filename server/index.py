from datetime import timedelta
from math import ceil
from typing import Optional
from fastapi import FastAPI, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from bson.objectid import ObjectId
from models import RegisterData, LoginData, PostCreateUpdateData, CommentData, User
from config import origins, settings, db
from schemas import posts_serializer, post_serializer, user_serializer, likes_serializer, post_detail_serializer
from auth import ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token, get_password_hash, verify_password, getAuthUser
from pymongo import ReturnDocument

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoints  
@app.get("/posts")
def getPosts(page: Optional[str] = Query(1)):
  try:
    limit = 10
    page = int(page)
    startIndex = (page-1)*limit
    aggregate = [
      {
        "$lookup":{
          "from": "users",
          "localField":"user", 
          "foreignField": "_id",
          "as":"user",
        }
      },
      {"$skip": startIndex},
      {"$limit": limit}
    ]

    posts = db.posts.aggregate(aggregate)
    
    aggregate.append({"$count": "total"})
    
    total = db.posts.aggregate(aggregate)
    total = next(total)["total"]

    return JSONResponse(
      content = { 
        "data": posts_serializer(posts), 
        "currentPage": page, 
        "numberOfPages": ceil(total / limit)
      })
  except Exception as e:
    return JSONResponse(status_code=400, content = e)

@app.get("/posts/search")
def getPosts(page: Optional[str] = Query(1), username: Optional[str] = Query(None), searchQuery: Optional[str]=Query(None), tags: Optional[str] = Query(None)):
  try:
    limit = 10
    page = int(page)
    startIndex = (page-1)*limit
    query = []

    aggregate = [
      {
        "$lookup":{
          "from": "users",
          "localField":"user", 
          "foreignField": "_id",
          "as":"user",
        }
      },
      {"$skip": startIndex},
      {"$limit": limit}
    ]

    if searchQuery:
      query.append({"title":{ "$regex": searchQuery, "$options": 'xi' }})

    if tags:
      tags = tags.split(',')
      query.append({"tags": {"$in": tags}})

    if query:
      aggregate.insert(0, {"$match": { "$or": query}})

    posts = db.posts.aggregate(aggregate)
    
    aggregate = [item for item in aggregate if "$match" in item]
    aggregate.append({"$count": "total"})
    
    total = db.posts.aggregate(aggregate)
    
    total = next(total)["total"]

    return JSONResponse(
      content = { 
        "data": posts_serializer(posts), 
        "currentPage": page, 
        "numberOfPages": ceil(total / limit)
      })
  except Exception as e:
    return JSONResponse(status_code=400, content = e)

@app.get("/posts/{post_id}")
def getPost(post_id:str):
  try:
    post = db.posts.aggregate([
      { "$match": { "_id":  ObjectId(post_id)} },
      {
        "$lookup": {
          "from": "users",
          "localField": "user", 
          "foreignField": "_id",
          "as": "user",
        }
      }
    ])
    
    post = next(post)

    return post_detail_serializer(post)
  except Exception as e:
    return JSONResponse(status_code=400, content = e)

@app.post("/posts")
def createPost(data: PostCreateUpdateData, user: User = Depends(getAuthUser)):
  try:
    posts = db.posts
    post = posts.insert_one({
      "title": data.title,
      "message": data.message,
      "tags": data.tags,
      "selectedFile": data.selectedFile,
      "user": ObjectId(user.id)
    })

    post = posts.aggregate([
      { "$match": { "_id":  ObjectId(post["_id"])} },
      {
        "$lookup": {
          "from": "users",
          "localField": "user", 
          "foreignField": "_id",
          "as": "user",
        }
      }
    ])
    
    post = next(post)

    return post_detail_serializer(post)  
  except Exception as e:
    return JSONResponse(status_code=400, content=e)

@app.patch("/posts/{post_id}/like")
def likePost(post_id: str, user: User = Depends(getAuthUser)):
  try:  
    posts = db.posts
    post = posts.find_one({"_id": ObjectId(post_id)}, {"likes": 1})

    index = None
    if "likes" in post and len(post["likes"]) > 0:
      index = likes_serializer(post["likes"]).index(user.id)

    if index is None:
      post = posts.update_one({"_id": ObjectId(post_id)}, { "$push": { "likes": ObjectId(user.id)}})
      return JSONResponse(content = {"message": "Liked"})
    else:
      post = posts.update_one({"_id": ObjectId(post_id)}, { "$pull": { "likes": ObjectId(user.id)}})
      return JSONResponse(content = {"message": "Like Removed"})

  except Exception as e:
    return JSONResponse(status_code=400, content = e)

@app.post("/posts/{post_id}/comments")
def commentPost(post_id: str, data: CommentData, user: User = Depends(getAuthUser)):
  try:
    posts = db.posts

    post = posts.update_one({"_id": ObjectId(post_id)}, { 
      "$push": { "comments": { "user": ObjectId(user.id), "username": user.username,"comment": data.comment } } 
    })

    post = posts.aggregate([
      { "$match": { "_id":  ObjectId(post_id)} },
      {
        "$lookup": {
          "from": "users",
          "localField": "user", 
          "foreignField": "_id",
          "as": "user",
        }
      }
    ])
    
    post = next(post)

    return post_detail_serializer(post)  
  except Exception as e:
    return JSONResponse(status_code=400, content = e)

@app.patch("/posts/{post_id}")
def updatePost(post_id: str, data: PostCreateUpdateData, user: User = Depends(getAuthUser)):
  try:
    post = db.posts.find_one_and_update({"_id": post_id, "user": ObjectId(user.id) }, {
      "$set": {
        "title": data.title, 
        "message": data.message, 
        "tags": data.tags,
        "selectedFile": data.selectedFile
      }
    }, return_document = ReturnDocument.AFTER)
  
    return post_serializer(post)
  except Exception as e:
    return JSONResponse(status_code=400, content = e)

@app.delete("/posts/{post_id}")
def deletePost(post_id: str, user: User = Depends(getAuthUser)):
  try:
    post = db.posts.delete_one({"_id": post_id, "user": ObjectId(user.id) })

    return post_serializer(post)
  except Exception as e:
    return JSONResponse(status_code=400, content = e)

@app.post("/auth/login")
def login(data: LoginData):
  try:
    oldUser = db.users.find_one({ "email": data.email })

    if oldUser and verify_password(data.password, oldUser["password"]):
      oldUser = user_serializer(oldUser)
      
      token = create_access_token(
        data={"id": oldUser["id"]}, expires_delta= timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
      )

      return JSONResponse(content = {"result": oldUser, "token": token})
    else:
      return JSONResponse(status_code=401, content={"message": "Email or password is incorrect!"})

  except Exception as e:
    return JSONResponse(status_code=400, content = e)

@app.post("/auth/register")
async def register(data: RegisterData):
  try:
    oldUser = db.users.find_one({ "email": data.email })

    if oldUser:
      return JSONResponse(status_code=400, content={"message": "User exists!"})
    else:
      hashedPassword = get_password_hash(data.password)

      try:
        user = db.users.insert_one({
          "username": data.firstName + ' ' + data.lastName,
          "email": data.email,
          "password": hashedPassword
        }) 

        user = db.users.find_one({"_id": ObjectId(user.inserted_id)})

        user = user_serializer(user)

        token = create_access_token(
          data={"id": user["id"]}, expires_delta= timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
      except Exception as e:
        return JSONResponse(status_code=400, content = e)

      return JSONResponse(status_code= 201, content= {"result": user, "token": token})
  except Exception as e:
    return JSONResponse(status_code=400, content=e)
