from src import app, db
import src.models
with app.app_context():
    print('Creating all tables in the database...')
    db.create_all()
    print('Created all tables in the database successfully!')