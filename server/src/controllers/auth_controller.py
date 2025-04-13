import traceback
from flask_jwt_extended import create_access_token
from flask import request, session
from src import db, bc
from src.models import User
from src.errors import InvalidAPIUsage
from sqlalchemy.exc import IntegrityError
from flask import make_response
from flask_restful import Resource
from datetime import datetime


class Login(Resource):

    def post(self):
        body = request.get_json()
        email = body['email']
        password = body['password']
        user = User.query.filter_by(email=email).first()
        if not user or not bc.check_password_hash(user.password, password):
            raise InvalidAPIUsage(
                message='Invalid email or password', status_code=400)

        access_token = create_access_token(identity=user.id)
        response = make_response(
            {'status': 'sucess', 'data': user.to_dict()}, 200)

        response.set_cookie('jwt', access_token,
                            max_age=365*24*60*60, samesite='lax')

        return response


class Register(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        last_name = data.get('lastName')
        first_name = data.get('firstName')
        username = f"{first_name} {last_name}"
        avatar = "https://res.cloudinary.com/dloeqfbwm/image/upload/v1713013364/avatar_user/default_avatar.jpg"
        background = "https://res.cloudinary.com/dloeqfbwm/image/upload/v1713016596/background_user/default_background.png"
        last_online = datetime.now()
        new_user = None
        try:
            hashed_password = bc.generate_password_hash(password, 10)
            new_user = User(email=email, first_name=first_name,
                            last_name=last_name, password=hashed_password,
                            username=username, avatar=avatar, background=background,
                            last_online=last_online)
            db.session.add(new_user)
            db.session.commit()
            db.session.refresh(new_user)
        except IntegrityError:
            print(traceback.format_exc())
            db.session.rollback()
            raise InvalidAPIUsage(message='Email exist!', status_code=400)
        access_token = create_access_token(identity=new_user.id)
        response = make_response(
            {'status': 'sucess', 'data': new_user.to_dict()}, 200)

        response.set_cookie('jwt', access_token, httponly=True)

        return response


class Logout(Resource):
    def post(self):
        user_id = session.get('user_id')  # Retrieve user_id from session
        if user_id:
            user = User.query.get(user_id)
            user.last_online = datetime.now()
            db.session.commit()
        response = make_response(
            {'status': 'sucess'}, 200)
        response.set_cookie('jwt', '', httponly=True, max_age=10)

        return response
