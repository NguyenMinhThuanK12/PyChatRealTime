from flask import Blueprint
from src import app
from src.controllers import Login, Register, Logout
from src.auth import protect
from flask_restful import Api

auth_bp = Blueprint('auth', __name__, url_prefix='/api/v1/')
api = Api(auth_bp)
api.add_resource(Login, '/login')
api.add_resource(Register, '/register')
api.add_resource(Logout, '/logout')