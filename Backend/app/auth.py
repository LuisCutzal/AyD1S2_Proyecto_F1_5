from flask import Blueprint, request, jsonify
from app.connection import get_db_connection
import bcrypt  # Importa bcrypt

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()

    # Validación de datos
    required_fields = ['nombre', 'apellido', 'nombre_usuario', 'email', 'contrasena', 'id_rol']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Field {field} is required"}), 400

    nombre = data['nombre']
    apellido = data['apellido']
    nombre_usuario = data['nombre_usuario']
    email = data['email']
    contrasena = data['contrasena']
    id_rol = data['id_rol']

    # Encriptar la contraseña
    hashed_password = bcrypt.hashpw(contrasena.encode('utf-8'), bcrypt.gensalt())

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    cursor = conn.cursor()

    try:
        # Inserción de datos en la tabla Usuarios
        cursor.execute('''
            INSERT INTO Usuarios (nombre, apellido, nombre_usuario, email, contrasena, id_rol)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (nombre, apellido, nombre_usuario, email, hashed_password.decode('utf-8'), id_rol))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "User registered successfully"}), 201
    except pyodbc.IntegrityError as e:
        # Manejar errores de integridad como violaciones de claves únicas
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        # Manejar otros errores
        return jsonify({"error": str(e)}), 500

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
