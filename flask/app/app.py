from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite"
    db.init_app(app)
    CORS(app, resources={r"/*": {"origins": "http://localhost:5173", "supports_credentials": True}})

    from app.routes import resgiter_routes
    resgiter_routes(app)

    from app.auth.routes import auth
    app.register_blueprint(auth, url_prefix="/api/v1/auth")

    from app.user.routes import user
    app.register_blueprint(user, url_prefix="/api/v1/user")

    migrate = Migrate(app,db)
    
    return app