from flask import Blueprint
from src.controllers import Users, Me, UserConversations,MeConversations,MeAvatar, MeBackground, SearchUsers
from flask_restful import Api

user_bp = Blueprint('user', __name__, url_prefix='/api/v1/users')
api = Api(user_bp)
api.add_resource(Users, '/', '/<int:user_id>')
api.add_resource(Me, '/me')
api.add_resource(UserConversations, '/<int:user_id>/conversations')
api.add_resource(MeConversations, '/me/conversations')
api.add_resource(MeAvatar, '/me/avatar')
api.add_resource(MeBackground, '/me/background')
api.add_resource(SearchUsers, '/search')

