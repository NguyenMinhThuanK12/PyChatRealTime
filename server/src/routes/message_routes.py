from flask import Blueprint
from src.controllers import MessageRevoke, Messages
from flask_restful import Api
message_bp = Blueprint('message', __name__,
                          url_prefix='/api/v1/messages')

api = Api(message_bp)
api.add_resource(MessageRevoke, '/<int:message_id>/revoke')
api.add_resource(Messages, '/<int:message_id>')
