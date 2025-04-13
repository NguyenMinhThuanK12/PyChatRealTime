from flask import session
from src import socketio, db
from flask_socketio import join_room, leave_room, send, emit
from src.models import Message, Conversation, MessageType, User, Attachment, Participant
from flask import request
from datetime import datetime
import base64
from io import BytesIO
from PIL import Image
from cloudinary import uploader


# Dictionary to store user session IDs
user_session = {}


@socketio.on('connect')
def handle_connect():
    user_id = request.args.get('userID')
    if user_id:
        session['user_id'] = user_id
        user = User.query.get(user_id)
        if user:
            user.last_online = None
            db.session.commit()
        session_id = request.sid
        user_session[user_id] = session_id
        print(user_session)


@socketio.on('disconnect')
def handle_disconnect():
    user_id = session.get('user_id')
    if user_id:
        user = User.query.get(user_id)
        if user:
            user.last_online = datetime.now()
            db.session.commit()
            user_session.pop(str(user_id), None)


@socketio.on('join')
def handle_join(data):
    channel_id = data['channel_id']
    join_room(room=channel_id)
    print(f'{session["user_id"]} Joined room {channel_id}')


@socketio.on('leave')
def handle_leave(data):
    channel_id = data['channel_id']
    leave_room(channel_id)
    print(f'Left room {channel_id}')


@socketio.on('message')
def handle_message(data):
    message_type = MessageType(data['type'])
    message = None
    if message_type == MessageType.TEXT:
        message = handle_text_message(data)
    elif message_type == MessageType.IMAGE:
        message = handle_image_message(data)

    emit('message', message.to_dict(), room=data['channel_id'])

    conversation = Conversation.query.get(data['channel_id'])
    participants = conversation.participants
    for participant in participants:
        if participant.user_id == data['user_id']:
            participant.seen_at = datetime.now()
        else:
            participant.seen_at = None
    db.session.commit()
    db.session.refresh(conversation)
    conversation = conversation.to_dict()
    
    for participant in conversation['participants']:
        if str(participant['user_id']) in user_session:
            conversation_temp = conversation.copy()
            friend_index, user_index = 0, 1
            if conversation_temp['participants'][0]['user']['id'] == participant['user_id']:
                friend_index, user_index = 1, 0
            conversation_temp['friend'] = conversation_temp['participants'][friend_index]['user']
            conversation_temp['seen_at'] = conversation_temp['participants'][user_index]['seen_at']
            del conversation_temp['participants']
            emit('new_conversation_coming', conversation_temp,
                 room=user_session[str(participant['user_id'])])


@socketio.on('seen')
def handle_seen(data):
    conversation_id = data['conversation_id']
    user_id = data['user_id']
    participant = db.session.query(Participant).filter_by(
        conversation_id=conversation_id, user_id=user_id).first()
    participant.seen_at = datetime.now()
    db.session.commit()


def handle_text_message(data):
    channel_id = data['channel_id']
    user_id = data['user_id']
    time = float(data['time'])/1000
    message_type = MessageType(data['type'])
    conversation = Conversation.query.get(channel_id)
    message = data['message']
    new_message = Message(user_id=user_id, message=message,
                          conversation_id=conversation.id, time=datetime.fromtimestamp(time),
                          type=message_type)
    db.session.add(new_message)
    db.session.commit()
    db.session.refresh(new_message)
    conversation.last_message_id = new_message.id
    db.session.commit()
    return new_message


def handle_image_message(data):
    channel_id = data['channel_id']
    user_id = data['user_id']
    time = float(data['time'])/1000
    message_type = MessageType(data['type'])
    conversation = Conversation.query.get(channel_id)
    new_message = Message(user_id=user_id, conversation_id=channel_id,
                          time=datetime.fromtimestamp(time),
                          type=message_type)
    conversation.last_message_id = new_message.id
    db.session.add(new_message)
    db.session.commit()
    db.session.refresh(new_message)
    conversation.last_message_id = new_message.id
    db.session.commit()
    image_datas = data['imageDatas']
    for image_data in image_datas:
        file_extension = image_data['fileExtension']
        image_bytes = base64.b64decode(image_data['image'])
        img = Image.open(BytesIO(image_bytes))
        image_stream = BytesIO()
        file_extension = 'JPEG' if file_extension.lower() == 'jpg' else file_extension.upper()
        img.save(image_stream, format=file_extension)
        image_stream.seek(0)  # Reset the stream position to the beginning
        upload_result = uploader.upload(
            image_stream, folder="message_image", resource_type="image")
        attachment = Attachment(
            message_id=new_message.id, url=upload_result['url'])
        db.session.add(attachment)
    db.session.commit()
    return new_message
