from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_bcrypt import Bcrypt
from flask_babel import Babel
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import cloudinary
# Initialize Flask app
app = Flask(__name__)
app.config.from_object('src.config.Config')
cloudinary.config(
    cloud_name=app.config['CLOUDINARY_CLOUD_NAME'],
    api_key=app.config['CLOUDINARY_API_KEY'],
    api_secret=app.config['CLOUDINARY_API_SECRET']
)
# Initialize Flask extensions
cors = CORS(app, resources={
            r"/api/*": {"origins": "*"}}, supports_credentials=True)
jwt = JWTManager(app)
# socketio allow all origins
max_http_buffer_size = 100 * 1024 * 1024  # 100MB
socketio = SocketIO(
    app, max_http_buffer_size=max_http_buffer_size, cors_allowed_origins="*")

db = SQLAlchemy(app)
bc = Bcrypt(app)
lm = LoginManager()
lm.init_app(app)

# Define before request handler
# @app.before_request
# def before_request():
#     session.permanent = True
#     app.permanent_session_lifetime = timedelta(minutes=5)


# Initialize Flask-Restful Api

# Add RESTful resource to the API
