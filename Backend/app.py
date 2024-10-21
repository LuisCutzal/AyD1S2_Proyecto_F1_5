from flask import Flask
from flask_cors import CORS
from app.auth import auth_bp
from app.admin import admin_bp
from app.cliente import cliente_bp
from config import load_config
from app.email import init_mail  # Importa la función para inicializar Flask-Mail
app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})
load_config(app)
init_mail(app)
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(admin_bp, url_prefix='/admin')
app.register_blueprint(cliente_bp, url_prefix='/cliente')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
