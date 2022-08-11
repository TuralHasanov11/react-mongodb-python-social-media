from datetime import datetime, timedelta
from math import ceil
from typing import Optional
from fastapi import FastAPI, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from bson.objectid import ObjectId
from models import RegisterData, LoginData, PostCreateUpdateData, CommentData, User
from config import origins, settings, db
from schemas import posts_serializer, post_serializer, user_serializer, likes_serializer, post_detail_serializer, comments_serializer
from auth import Auth
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
    limit = 8
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
      {"$sort": {"createdAt": -1}},
      {"$skip": startIndex},
      {"$limit": limit}
    ]

    posts = db.posts.aggregate(aggregate)
        
    total = db.posts.aggregate([
      aggregate[0],
      {"$count": "total"}
    ])

    total = list(total) or 0    
    if total:
      total = total[0]["total"]
    

    return JSONResponse(
      content = { 
        "data": posts_serializer(posts), 
        "currentPage": page, 
        "numberOfPages": ceil(total / limit)
      })
  except Exception as e:
    return JSONResponse(status_code=400, content = e)

@app.get("/posts/search")
def searchPosts(page: Optional[str] = Query(1), username: Optional[str] = Query(None), searchQuery: Optional[str]=Query(None), tags: Optional[str] = Query(None)):
  try:
    limit = 8
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
    ]

    if searchQuery:
      query.append({"title":{ "$regex": searchQuery, "$options": 'xi' }})

    if tags:
      tags = tags.split(',')
      query.append({"tags": {"$in": tags}})

    if query:
      aggregate.insert(0, {"$match": { "$or": query}})
    
    aggregate = [item for item in aggregate if "$match" in item]
    aggregate.append({"$count": "total"})
    
    total = db.posts.aggregate(aggregate)
    total = list(total) or 0    
    if total:
      total = total[0]["total"]
    
    aggregate.pop()
    aggregate.append({"$sort": {"createdAt": -1}})
    aggregate.append({"$skip": startIndex})
    aggregate.append({"$limit": limit})

    posts = db.posts.aggregate(aggregate)
    
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
def createPost(data: PostCreateUpdateData, user: User = Depends(Auth.getAuthUser)):
  try:
    posts = db.posts
    createdAtDate = datetime.now()
    
    post = posts.insert_one({
      "title": data.title,
      "message": data.message,
      "tags": data.tags,
      "selectedFile": data.selectedFile,
      "user": ObjectId(user.id),
      "createdAt": createdAtDate.timestamp()
    })

    post = posts.aggregate([
      { "$match": { "_id":  ObjectId(str(post.inserted_id))} },
      {
        "$lookup": {
          "from": "users",
          "localField": "user", 
          "foreignField": "_id",
          "as": "user",
        }
      }
    ])
    
    return post_detail_serializer(next(post))  
  except Exception as e:
    return JSONResponse(status_code=400, content=e)

@app.patch("/posts/{post_id}/like")
def likePost(post_id: str, user: User = Depends(Auth.getAuthUser)):
  try:  
    posts = db.posts
    post = posts.find_one({"_id": ObjectId(post_id)}, {"likes": 1})

    index = None
    if "likes" in post and len(post["likes"]) > 0:
      index = likes_serializer(post["likes"]).index(user.id)

    if index is None:
      post = posts.find_one_and_update({"_id": ObjectId(post_id)}, { "$push": { "likes": ObjectId(user.id)}}, projection = { "likes" : 1 }, return_document = ReturnDocument.AFTER)
    else:
      post = posts.find_one_and_update({"_id": ObjectId(post_id)}, { "$pull": { "likes": ObjectId(user.id)}}, projection = { "likes" : 1 }, return_document = ReturnDocument.AFTER)

    return {"id": str(post["_id"]), "likes": likes_serializer(post["likes"])}

  except Exception as e:
    return JSONResponse(status_code=400, content = e)

@app.post("/posts/{post_id}/comments")
def commentPost(post_id: str, data: CommentData, user: User = Depends(Auth.getAuthUser)):
  try:
    posts = db.posts

    post = posts.find_one_and_update({"_id": ObjectId(post_id)}, { 
      "$push": { "comments": { "user": ObjectId(user.id), "username": user.username,"comment": data.comment } } 
    })

    return {"id":str(post["_id"]), "comments":comments_serializer(post["comments"])}
  except Exception as e:
    return JSONResponse(status_code=400, content = e)

@app.patch("/posts/{post_id}")
def updatePost(post_id: str, data: PostCreateUpdateData, user: User = Depends(Auth.getAuthUser)):
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
def deletePost(post_id: str, user: User = Depends(Auth.getAuthUser)):
  try:
    post = db.posts.delete_one({"_id": ObjectId(post_id), "user": ObjectId(user.id) })

    return post_id
  except Exception as e:
    return JSONResponse(status_code=400, content = e)

@app.post("/auth/login")
def login(data: LoginData):
  try:
    user = db.users.find_one({ "email": data.email })

    if user and Auth.verify_password(data.password, user["password"]):
      user = user_serializer(user)
      
      token = Auth.create_access_token(
        data={"id": user["id"]}, expires_delta= timedelta(minutes=Auth.ACCESS_TOKEN_EXPIRE_MINUTES)
      )

      user["token"] = token

      return JSONResponse(content=user)
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
      hashedPassword = Auth.get_password_hash(data.password)

      try:
        user = db.users.insert_one({
          "username": data.firstName + ' ' + data.lastName,
          "email": data.email,
          "password": hashedPassword
        }) 

        user = db.users.find_one({"_id": ObjectId(user.inserted_id)})

        user = user_serializer(user)

        token = Auth.create_access_token(
          data={"id": user["id"]}, expires_delta= timedelta(minutes=Auth.ACCESS_TOKEN_EXPIRE_MINUTES)
        )

        user["token"] = token
      except Exception as e:
        return JSONResponse(status_code=400, content = e)

      return JSONResponse(status_code= 201, content= user)
  except Exception as e:
    return JSONResponse(status_code=400, content=e)
