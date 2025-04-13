from src.controllers import Friendships, FriendshipsRequest, FriendshipsAccept, FriendshipsBlock, FriendshipUnfriend
from flask import Blueprint
from flask_restful import Api

friendship_bp = Blueprint('friendship', __name__,
                          url_prefix='/api/v1/friendships')
api = Api(friendship_bp)
api.add_resource(Friendships, '/', '/<int:friendship_id>')
api.add_resource(FriendshipsRequest, '/request')
api.add_resource(FriendshipsAccept, '/accept')
api.add_resource(FriendshipsBlock, '/block')
api.add_resource(FriendshipUnfriend, '/unfriend')
