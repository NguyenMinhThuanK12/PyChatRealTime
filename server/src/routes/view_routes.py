

from flask import Blueprint
from flask import render_template, request, url_for, redirect, flash
from jinja2 import TemplateNotFound
from src.controllers.view_controller import ViewController
from src import app, db, bc
from src.models import User, Conversation, Participant, Message, MessageType, Attachment

view_dp = Blueprint('view', __name__, url_prefix='/')


@app.route('/r/<room_id>/<user_id>')
def index(room_id, user_id):
   
    return ViewController.index(room_id,user_id)
