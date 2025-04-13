from flask import request
from src.errors import InvalidAPIUsage
from src import db
from src.models import User, Friendship
from src.auth import protect
from src.util.api_features import APIFeatures
from flask_restful import Resource
from flask import request, make_response
from cloudinary import uploader, api


class Users(Resource):
    @protect()
    def get(self, user_id=None):
        if user_id == None:
            api_freatures = APIFeatures(User, request.args)
            items, total_count = api_freatures.perform_query()
            response = make_response(
                {'status': 'sucess', 'total_count': total_count, 'data': [item.to_dict() for item in items]}, 200)
            return response
        else:
            user = User.query.get(user_id)
            if not user:
                raise InvalidAPIUsage(
                    message='User does not exist!', status_code=400)
            response = make_response(
                {'status': 'sucess', 'data': user.to_dict()}, 200)
            return response

    def patch(self, user_id):
        data = request.get_json()
        user = User.query.get(user_id)
        if not user:
            raise InvalidAPIUsage(
                message='User does not exist!', status_code=400)
        for key, value in data.items():
            setattr(user, key, value)
        db.session.commit()
        response = make_response(
            {'status': 'sucess', 'data': user.to_dict()}, 200)
        return response


class Me(Resource):
    @protect()
    def get(self):
        response = make_response(
            {'status': 'sucess', 'data': request.user.to_dict()}, 200)
        return response


class MeAvatar(Resource):
    @protect()
    def patch(self):
        user = request.user
        if 'avatar' in request.files:
            if user.avatar and 'default' not in user.avatar:
                public_id = user.avatar.split('/')[-1].split('.')[0]
                uploader.destroy(f'avatar_user/{public_id}', invalidate=True)
            file = request.files['avatar']
            upload_result = uploader.upload(
                file, folder="avatar_user", resource_type="image")
            user.avatar = upload_result['url']
            db.session.commit()
        else:
            raise InvalidAPIUsage(
                message='File not found!', status_code=400)
        response = make_response(
            {'status': 'sucess', 'data': user.to_dict()}, 200)
        return response


class MeBackground(Resource):
    @protect()
    def patch(self):
        user = request.user
        if 'background' in request.files:
            if user.background and 'default' not in user.background:
                public_id = user.background.split('/')[-1].split('.')[0]
                uploader.destroy(
                    f'background_user/{public_id}', invalidate=True)
            file = request.files['background']
            upload_result = uploader.upload(
                file, folder="background_user", resource_type="image")
            user.background = upload_result['url']
            db.session.commit()
        else:
            raise InvalidAPIUsage(
                message='File not found!', status_code=400)
        response = make_response(
            {'status': 'sucess', 'data': user.to_dict()}, 200)
        return response


class SearchUsers(Resource):
    @protect()
    def get(self):
        q = request.args.get('q')
        query = (db.session.query(User, Friendship.status)
                 .join(Friendship, ((Friendship.friend_id == User.id) & (
                     Friendship.user_id == request.user.id)), isouter=True)

                 )
        if '@gmail.com' in q:
            query = query.filter(User.email == q)
        else:
            query = query.filter(User.username.ilike(f'%{q}%'))
        query = query.filter(User.id != request.user.id)
        users = query.all()
        users = [{**user.to_dict(), 'status': status.value if status else 'not_friend'}
                 for user, status in users]
        users.sort(key=lambda x: ['friends', 'request_received',
                   'request_sent', 'not_friend', 'blocked'].index(x['status']))
        users = [user for user in users if user['status'] != 'blocked']
        response = make_response(
            {'status': 'sucess', 'total_count': len(users), 'data': users}, 200)
        return response
