from src.errors import InvalidAPIUsage
from src.models import Conversation, Participant
from src.util.api_features import APIFeatures
from src import db
from flask_restful import Resource
from flask import request, make_response
from src.auth import protect
from datetime import datetime


class Conversations(Resource):
    def get(self, conversation_id=None):
        if conversation_id == None:
            api_freatures = APIFeatures(Conversation, request.args)
            items, total_count = api_freatures.perform_query()
            response = make_response(
                {'status': 'sucess', 'total_count': total_count, 'data': [item.to_dict() for item in items]}, 200)
            return response
        else:
            conversation = Conversation.query.get(conversation_id)
            if not conversation:
                raise InvalidAPIUsage(
                    message='Conversation does not exist!', status_code=400)
            response = make_response(
                {'status': 'sucess', 'data': conversation.to_dict()}, 200)
            return response

    @protect()
    def delete(self, conversation_id):
       
        conversation = Conversation.query.get(conversation_id)
        if not conversation:
            raise InvalidAPIUsage(
                message='Conversation does not exist!', status_code=400)
        participant = db.session.query(Participant).filter(
            Participant.conversation_id == conversation_id, Participant.user_id == request.user.id).first()
        if not participant:
            raise InvalidAPIUsage(
                message='You are not a participant of this conversation!', status_code=400)
        participant.delete_at = datetime.now()
        db.session.commit()
        response = make_response(
            {'status': 'sucess', 'data': None}, 204)
        return response


class UserConversations(Resource):
    @protect()
    def get(self, user_id):
        query = db.session.query(Conversation).join(
            Participant).filter(Participant.user_id == user_id)
        api_freatures = APIFeatures(Conversation, request.args)
        items, total_count = api_freatures.perform_query(query)
        items = [item.to_dict() for item in items]
        for conversation in items:
            friend_user_index = 0
            if conversation['participants'][0]['user']['id'] == request.user.id:
                friend_user_index = 1
            conversation['friend'] = conversation['participants'][friend_user_index]['user']
            del conversation['participants']
        response = make_response(
            {'status': 'sucess', 'total_count': total_count, 'data': items}, 200)
        return response


class MeConversations(Resource):
    @protect()
    def get(self):
        user = request.user
        query = db.session.query(Conversation).join(
            Participant).filter(Participant.user_id == user.id).order_by(Conversation.last_message_id.desc())
        api_freatures = APIFeatures(Conversation, request.args)
        items, total_count = api_freatures.perform_query(query)
        items = [item.to_dict() for item in items]
        for conversation in items:
            friend_index, user_index = 0, 1
            if conversation['participants'][0]['user']['id'] == request.user.id:
                friend_index, user_index = 1, 0
            conversation['friend'] = conversation['participants'][friend_index]['user']
            conversation['seen_at'] = conversation['participants'][user_index]['seen_at']
            del conversation['participants']
        response = make_response(
            {'status': 'sucess', 'total_count': total_count, 'data': items}, 200)
        return response
