from flask import Blueprint
from src.controllers import ConversationMessages, Conversations, ConversationImages
from flask_restful import Api

conversation_dp = Blueprint(
    'conversation', __name__, url_prefix='/api/v1/conversations')
api = Api(conversation_dp)
api.add_resource(Conversations, '/', '/<int:conversation_id>')
api.add_resource(ConversationMessages, '/<int:conversation_id>/messages')
api.add_resource(ConversationImages, '/<int:conversation_id>/images')

