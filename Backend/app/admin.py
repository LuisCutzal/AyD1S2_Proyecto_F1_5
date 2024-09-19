from flask import Blueprint, jsonify, request, current_app
from functools import wraps
import pyodbc
import jwt
import bcrypt
from app.decorators import token_required, admin_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin', methods=['GET'])
@token_required
@admin_required
def admin_route(current_user):
    print(current_user)
    return jsonify({"message": f"Welcome admin, user {current_user['nombre_usuario']}!"}), 200