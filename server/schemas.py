def post_serializer(post: dict):
    return {
        "id": str(post["_id"]),
        "title": post["title"],
        "message": post["message"],
        "selectedFile": post["selectedFile"],
        "tags": post["tags"],
        "user": user_serializer(post["user"][0]),
    }

def posts_serializer(posts: list):
    return [post_serializer(post) for post in posts]

def user_serializer(user):
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"],
    }  