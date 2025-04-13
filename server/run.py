from src import app, socketio
from src.routes import user_bp, auth_bp, friendship_bp, conversation_dp, view_dp, message_bp
import src.events

app.register_blueprint(user_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(friendship_bp)
app.register_blueprint(conversation_dp)
app.register_blueprint(view_dp)
app.register_blueprint(message_bp)

if __name__ == '__main__':
    socketio.run(app, allow_unsafe_werkzeug=True, host=app.config['SERVER_HOST'],  port=app.config['SERVER_PORT'], debug=True)
