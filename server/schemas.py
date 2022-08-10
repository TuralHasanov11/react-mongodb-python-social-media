def post_serializer(post: dict):
    return {
        "id": str(post["_id"]),
        "title": post["title"],
        "message": post["message"],
        "selectedFile": post["selectedFile"],
        "tags": post["tags"],
        "user": str(post["user"]),
        "likes": likes_serializer(post["likes"]),
        "createdAt": post["createdAt"]
    }

def post_list_item_serializer(post: dict):
    result = {
        "id": str(post["_id"]),
        "title": post["title"],
        "message": post["message"],
        "selectedFile": post["selectedFile"],
        "tags": post["tags"],
        "user": user_serializer(post["user"][0]),
        "createdAt": post["createdAt"]
    }

    if "likes" in post:
        result["likes"] = likes_serializer(post["likes"])
    else:
        result["likes"] = []

    return result 

def post_detail_serializer(post: dict):
    result = {
        "id": str(post["_id"]),
        "title": post["title"],
        "message": post["message"],
        "selectedFile": post["selectedFile"],
        "tags": post["tags"],
        "user": user_serializer(post["user"][0]),
        "createdAt": post["createdAt"]
    }

    if "likes" in post:
        result["likes"] = likes_serializer(post["likes"])
    else:
        result["likes"] = []

    if "comments" in post:
        result["comments"] = comments_serializer(post["comments"])

    return result 

def posts_serializer(posts: list):
    return [post_list_item_serializer(post) for post in posts]

def user_serializer(user):
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"],
    }  

def likes_serializer(likes):
    if likes:
        return [str(item) for item in likes]
    return []

def comments_serializer(comments):
    if comments:
        return [{"user_id": str(item["user"]), "username":item["username"], "comment": item["comment"]} for item in comments]
    return []