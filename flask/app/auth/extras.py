import os
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
import requests
from functools import wraps
from flask import request, jsonify
from jwt import decode

# Important variables
CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")


def get_access_token(auth_code):
    # Set up the OAuth2 client
    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": CLIENT_ID,
                "client_secret": CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=[
            "https://www.googleapis.com/auth/userinfo.email",
            "openid",
            "https://www.googleapis.com/auth/userinfo.profile",
        ],
        redirect_uri="postmessage",
    )
    # Exchange the authorization code for an access token
    flow.fetch_token(code=auth_code)
    credentials = flow.credentials

    return credentials.token


def get_user_info(access_token):
    url = f"https://www.googleapis.com/oauth2/v1/userinfo?access_token={access_token}"
    headers = {"Authorization": f"Bearer {access_token}", "Accept": "application/json"}
    response = requests.get(url, headers=headers)
    return response.json()


def authenticate_user(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = request.cookies.get("token")
        if not token:
            return jsonify({"message": "Unauthorized"}), 401
        try:
            decoded = decode(token, "secret", algorithms=["HS256"])
            return f(decoded["userId"], *args, **kwargs)
        except Exception as e:
            print(e)
            return jsonify({"message": "Unauthorized"}), 401

    return decorator
