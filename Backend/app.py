from flask import Flask
from app.auth import auth_bp
from app.admin import admin_bp
from config import load_config
from app.email import init_mail  # Importa la función para inicializar Flask-Mail
app = Flask(__name__)

load_config(app)
# Inicializa Flask-Mail
init_mail(app)
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(admin_bp, url_prefix='/admin')

if __name__ == '__main__':
    app.run(debug=True)
