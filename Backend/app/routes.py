from flask import Blueprint
from app.auth import register_user
from app.auth import login_user

def register_routes(app):
    # Registrar rutas para el manejo de usuarios
    @app.route('/register', methods=['POST'])
    def register():
        return register_user()
    @app.route('/login', methods=['GET'])
    def logIn():
        return login_user()
    
    # Puedes agregar más rutas aquí
