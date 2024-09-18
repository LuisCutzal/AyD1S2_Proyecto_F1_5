from flask import Blueprint, request, jsonify
from app.connection import get_db_connection
import bcrypt
import pyodbc
import re
auth_bp = Blueprint('auth', __name__)

# Expresión regular para validar email
email_regex = r'^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$'

@auth_bp.route('/register', methods=['POST'])
def register_user():
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
    id_rol = data['id_rol']
    espacio_asignado = data['espacio_asignado']

    # Validación de formato de email
    if not re.match(email_regex, email):
        return jsonify({"Error": "El correo no tiene el formato adecuado"}), 400

    # Encriptar la contraseña
    hashed_password = bcrypt.hashpw(contrasena.encode('utf-8'), bcrypt.gensalt())

    conn = get_db_connection()
    if conn is None:
        return 500

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

@auth_bp.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    if 'email' not in data or 'contrasena' not in data:
        return jsonify({"error": "Email and password are required"}), 400

    email = data['email']
    contrasena = data['contrasena']

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT id_usuario, contrasena FROM Usuarios WHERE email = ?', (email,))
    user = cursor.fetchone()

    if user and bcrypt.checkpw(contrasena.encode('utf-8'), user.contrasena.encode('utf-8')):
        return jsonify({"message": "Login successful", "user_id": user.id_usuario}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401
