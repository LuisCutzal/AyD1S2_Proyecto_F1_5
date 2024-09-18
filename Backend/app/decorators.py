from functools import wraps
from flask import request, jsonify, current_app
import jwt

def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        # Buscar el token en el encabezado Authorization
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]  # Obtener el token del encabezado
            
        if not token:
            return jsonify({"error": "Token is missing"}), 401

        try:
            # Decodificar el token
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            print(data)
            current_user = {'id_usuario': data['id_usuario'], 'id_rol': data['id_rol'], 'nombre_usuario': data['nombre_usuario']}
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(current_user, *args, **kwargs)
    return decorator


def admin_required(f):
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if current_user['id_rol'] != 1:
            return jsonify({'message': 'No tienes permiso para acceder a este recurso'}), 403
        return f(current_user, *args, **kwargs)
    return decorated


def empleado_required(f):
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if current_user['id_rol'] != 2:
            return jsonify({'message': 'No tienes permiso para acceder a este recurso'}), 403
        return f(current_user, *args, **kwargs)
    return decorated

def cliente_required(f):
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if current_user['id_rol'] != 3:
            return jsonify({'message': 'No tienes permiso para acceder a este recurso'}), 403
        return f(current_user, *args, **kwargs)
    return decorated
