from flask import Blueprint, jsonify, request
from app.connection import get_db_connection
from functools import wraps
import bcrypt
import pyodbc
import re
import jwt
from app.decorators import token_required, admin_required

admin_bp = Blueprint('admin', __name__)

email_regex = r'^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$'

@admin_bp.route('/admin', methods=['GET'])
@token_required
@admin_required
def admin_route(current_user):
    print(current_user)
    return jsonify({"message": f"Welcome admin, user {current_user['nombre_usuario']}!"}), 200


@admin_bp.route('/registers', methods=['POST'])
@token_required
@admin_required
def register_user(current_user):
    data = request.get_json()
    # Validación de datos
    required_fields = ['nombre', 'apellido', 'nombre_usuario', 'email', 'celular', 'nacionalidad', 'pais_residencia', 'contrasena', 'id_rol', 'espacio_asignado']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Field {field} is required"}), 400
    nombre = data['nombre']
    apellido = data['apellido']
    nombre_usuario = data['nombre_usuario']
    email = data['email']
    celular = data['celular']
    nacionalidad = data['nacionalidad']
    pais_residencia = data['pais_residencia']
    contrasena = data['contrasena']
    id_rol = data['id_rol'] #maneja 2 tipos de usuario: cliente y empleado (puede manejar adminsitradores)
    espacio_asignado = data['espacio_asignado']
    # Validación de formato de email
    if not re.match(email_regex, email):
        return jsonify({"Error": "El correo no tiene el formato adecuado"}), 400
    # Encriptar la contraseña
    hashed_password = bcrypt.hashpw(contrasena.encode('utf-8'), bcrypt.gensalt())
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Error connecting to the database"}), 500
    cursor = conn.cursor()
    try:
        # Verificar si el nombre de usuario o el email ya existen
        cursor.execute('SELECT * FROM Usuarios WHERE nombre_usuario = ? OR email = ?', (nombre_usuario, email))
        user_exists = cursor.fetchone()
        if user_exists:
            return jsonify({"Error": "El nombre de usuario o correo electronico ya existen"}), 409
        # Inserción de datos en la tabla Usuarios
        cursor.execute(''' 
            INSERT INTO Usuarios (nombre, apellido, nombre_usuario, email, celular, nacionalidad, pais_residencia, contrasena, id_rol, espacio_asignado)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (nombre, apellido, nombre_usuario, email, celular, nacionalidad, pais_residencia, hashed_password.decode('utf-8'), id_rol, espacio_asignado))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Usuario registrado correctamente"}), 201
    except pyodbc.IntegrityError as e:
        # Manejar errores de integridad como violaciones de claves únicas
        return jsonify({"Error": "Error en la integridad de la base de datos: " + str(e)}), 400
    except Exception as e:
        # Manejar otros errores
        return 500
    


@admin_bp.route('/users', methods=['GET'])
@token_required
@admin_required
def get_users(current_user):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT id_usuario, nombre_usuario, espacio_asignado, espacio_ocupado FROM Usuarios')
    users = cursor.fetchall()
    conn.close()
    
    users_list = [{"id_usuario": user[0], "nombre_usuario": user[1], "espacio_asignado": user[2], "espacio_ocupado": user[3]} for user in users]
    
    return jsonify(users_list), 200


@admin_bp.route('/users/<int:id_usuario>/update_space', methods=['PUT'])
@token_required
@admin_required  # Solo un administrador puede modificar el espacio
def update_user_space(current_user, id_usuario):
    data = request.get_json()
    nuevo_espacio_asignado = data.get('espacio_asignado')  # El espacio nuevo que ingresa el admin

    if nuevo_espacio_asignado is None:
        return jsonify({"error": "Se requiere el nuevo espacio asignado"}), 400

    # Conexión a la base de datos
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Obtener el espacio ocupado actual
    cursor.execute('SELECT espacio_ocupado FROM Usuarios WHERE id_usuario = ?', (id_usuario,))
    user_data = cursor.fetchone()

    if not user_data:
        return jsonify({"error": "Usuario no encontrado"}), 404

    espacio_ocupado = user_data[0]

    # Validación: Si el nuevo espacio es menor que el espacio ocupado, no se puede reducir
    if nuevo_espacio_asignado < espacio_ocupado:
        return jsonify({
            "error": "No se puede reducir el espacio porque el espacio ocupado ({}) es mayor que el nuevo espacio asignado ({})".format(espacio_ocupado, nuevo_espacio_asignado)
        }), 400

    # Actualizar el espacio asignado
    cursor.execute('UPDATE Usuarios SET espacio_asignado = ? WHERE id_usuario = ?',
                   (nuevo_espacio_asignado, id_usuario))
    conn.commit()
    conn.close()

    return jsonify({"message": "Espacio asignado actualizado correctamente"}), 200


