from app.models import User
from app.app import db
from flask import Blueprint, make_response, request, jsonify
from app.auth.extras import get_access_token, get_user_info
import jwt
from datetime import datetime
import os



auth = Blueprint("auth", __name__)

@auth.route('/', methods=['GET'])
def index():
    return "Auth Route"

@auth.route('/google', methods=['POST'])
def google_login():
    code : str  = request.get_json().get('code')
    if not code:
        return make_response(jsonify({"message":"Google Signin Failed"}), 400)
    access_token = get_access_token(code)
    try:
        user_info = get_user_info(access_token)
        print(user_info["email"])
        if not user_info['email'] or not user_info['name']:
            return make_response(jsonify({"message":"Google Signin Failed"}), 400)
        print(user_info)
        user = User.query.filter_by(email=user_info['email']).first()
        userId : int = user.id if user else -1
        if not user:
            user = User(
                email=user_info['email'],
                name=user_info['name'],
                avatarUrl=user_info['picture']
            )
            db.session.add(user)
            db.session.commit()
            userId = user.id
        
        # Generate JWT token
        token = jwt.encode({"userId":userId}, "secret") 

        response = make_response(jsonify({"message": "Google Signin Successful"}), 200)

        response.set_cookie("token", token, httponly=True, max_age= 7 * 24 * 60 * 60, samesite= None if os.getenv('ENV') == 'production' else 'lax', secure= True if os.getenv('ENV') == 'production' else False)
        
        return response
    except Exception as e:
        print(e)
        return make_response(jsonify({"message":"An error occurred"}), 500)
    
@auth.route('/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({"message":"Logged Out"}), 200)
    response.delete_cookie("token")
    return response