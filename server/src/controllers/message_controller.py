from flask import request
from src.auth import protect
from src import db
from src.errors import InvalidAPIUsage
from src.models import Message, MessageType, Conversation, DeletedMessage
from datetime import datetime
from flask import request, make_response
from src.util.api_features import APIFeatures
from flask_restful import Resource
from sqlalchemy import not_

class ConversationMessages(Resource):
    @protect()
    def get(self, conversation_id):
        conversation = Conversation.query.get(conversation_id)
        if not conversation:
            raise InvalidAPIUsage(
                message='Conversation not found', status_code=404)
        participants = conversation.participants
        user_participant = [p for p in participants if p.user_id ==
                            request.user.id][0] if participants else None
        if not user_participant:
            raise InvalidAPIUsage(
                message='You are not a participant of this conversation', status_code=403)
            
        # Subquery to get IDs of deleted messages by the user
        subquery = db.session.query(DeletedMessage.message_id).filter_by(user_id=request.user.id).subquery()

        # Query to retrieve messages not deleted by the user
        query = db.session.query(Message).filter(
            Message.conversation_id == conversation_id,
            ~Message.id.in_(subquery)
        )
        if user_participant.delete_at:
            query = query.filter(Message.time > user_participant.delete_at)
        api_freatures = APIFeatures(Message, request.args)
        items, total_count = api_freatures.perform_query(query)

        response = make_response(
            {'status': 'sucess', 'total_count': total_count, 'data': [item.to_dict() for item in items]}, 200)
        return response


class ConversationImages(Resource):
    def get(self, conversation_id):
        conversation = Conversation.query.get(conversation_id)
        if not conversation:
            raise InvalidAPIUsage(
                message='Conversation not found', status_code=404)
        query = db.session.query(Message).filter(
            Message.conversation_id == conversation_id, Message.type == MessageType.IMAGE)
        api_freatures = APIFeatures(Message, request.args)
        items, total_count = api_freatures.perform_query(query)
        items = [item.to_dict() for item in items]
        images = []
        for item in items:
            for attachment in item['attachments']:
                images.append(attachment['url'])
        response = make_response(
            {'status': 'sucess', 'total_count': total_count, 'data': images}, 200)
        return response


class MessageRevoke(Resource):
    @protect()
    def patch(self, message_id):
        message = Message.query.get(message_id)
        if not message:
            raise InvalidAPIUsage(
                message='Message not found', status_code=404)
        if message.user_id != request.user.id:
            raise InvalidAPIUsage(
                message='You are not the sender of this message', status_code=403)
        message.revoke_at = datetime.now()
        db.session.commit()
        response = make_response(
            {'status': 'sucess', 'data': message.to_dict()}, 200)
        return response


class Messages(Resource):
    @protect()
    def delete(self, message_id):
        message = Message.query.get(message_id)
        if not message:
            raise InvalidAPIUsage(
                message='Message not found', status_code=404)
        deleted_message = DeletedMessage.query.filter_by(
            message_id=message_id, user_id=request.user.id).first()
        if deleted_message:
            raise InvalidAPIUsage(
                message='Message already deleted', status_code=403)
        deleted_message = DeletedMessage(
            message_id=message_id, user_id=request.user.id, create_at=datetime.now())
        db.session.add(deleted_message)
        db.session.commit()
        response = make_response(
            {'status': 'sucess', 'data': None}, 204)
        return response
