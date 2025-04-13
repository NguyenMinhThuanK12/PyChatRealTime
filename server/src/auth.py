from flask import request
from functools import wraps
from flask_jwt_extended import get_jwt_identity, jwt_required, decode_token
from src.errors import InvalidAPIUsage
from src.models import User
from src import db


def protect():
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            jwt_token = get_jwt_token(request)
            if not jwt_token:
                raise InvalidAPIUsage(
                    message='You are not logged in! Please log in to get access.', status_code=401)
            else:
                decoded_token = decode_token(jwt_token)
                # Assuming 'sub' contains the user ID
                user_id = decoded_token['sub']
                user = User.query.get(user_id)
                setattr(request, 'user', user)
            return f(*args, **kwargs)
        return decorated_function
    return decorator


def get_jwt_token(request):
    # Check for JWT token in headers
    authorization_header = request.headers.get('Authorization')
    if authorization_header and authorization_header.startswith('Bearer '):
        return authorization_header.split(' ')[1]

    # If not found in headers, check for JWT token in cookies
    jwt_token = request.cookies.get('jwt')
    return jwt_token
