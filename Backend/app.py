from flask import Flask
from app.auth import auth_bp
from config import load_config
app = Flask(__name__)

load_config(app)
app.register_blueprint(auth_bp, url_prefix='/auth')

if __name__ == '__main__':
    app.run(debug=True)
