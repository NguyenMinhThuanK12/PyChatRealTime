from flask import render_template, redirect, url_for, flash, request
from flask_login import current_user
from src import db
from src.models import Conversation, Participant, User, Message


class ViewController:
    @staticmethod
    def index(room_id, user_id):
        user = db.session.query(User).get(user_id)
        messages = db.session.query(Message).filter(Message.conversation_id == room_id).all()
        messages = [message.to_dict() for message in messages]
        conversation = Conversation.query.get(room_id)
        conversation = conversation.to_dict()  # Move inside the loop
        friend_index, user_index = 0, 1
        if conversation['participants'][0]['user']['id'] == user_id:
            friend_index, user_index = 1, 0
        conversation['friend'] = conversation['participants'][friend_index]['user']
        is_seen = conversation['participants'][user_index]['seen_at']
        return render_template('index.html', user=user, messages=messages, is_seen=is_seen)
