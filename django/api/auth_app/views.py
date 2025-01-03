from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse
from django.views.decorators.http import require_GET, require_POST
from .extras import get_access_token, get_user_info
from .models import User
import jwt
import os
import json


# Create your views here.
@require_GET
def index(request: HttpRequest):
    return HttpResponse("Auth Route")


@require_POST
def google_login(request: HttpRequest):
    data = json.loads(request.body)
    code: str = data.get("code")
    print(request.body)
    if not code:
        return JsonResponse({"message": "Google Signin Failed"}, status=400)
    access_token = get_access_token(code)
    try:
        user_info = get_user_info(access_token)
        print(user_info["email"])
        if not user_info["email"] or not user_info["name"]:
            return JsonResponse({"message": "Google Signin Failed"}, status=400)
        print(user_info)
        user = User.objects.filter(email=user_info["email"]).first()
        userId: int = user.id if user else -1
        if not user:
            user = User(
                email=user_info["email"],
                name=user_info["name"],
                avatarUrl=user_info["picture"],
            )
            user.save()
            userId = user.id

        # Generate JWT token
        token = jwt.encode({"userId": userId}, "secret", algorithm="HS256")
        print(token, userId)
        response = JsonResponse({"message": "Google Signin Successful"}, status=200)

        response.set_cookie(
            "token",
            token,
            httponly=True,
            max_age=7 * 24 * 60 * 60,
            samesite=None if os.getenv("ENV") == "production" else "lax",
            secure=True if os.getenv("ENV") == "production" else False,
        )

        return response
    except Exception as e:
        print(e)
        return JsonResponse({"message": "An error occurred"}, status=500)


@require_POST
def logout(request: HttpRequest):
    response = JsonResponse({"message": "Logged Out"}, status=200)
    response.delete_cookie("token")
    return response
