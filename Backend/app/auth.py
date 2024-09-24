from flask import Blueprint, request, jsonify, current_app
from app.connection import get_db_connection
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import bcrypt
import pyodbc
import re
import jwt
from datetime import datetime, timedelta
import smtplib

auth_bp = Blueprint('auth', __name__)

email_regex = r'^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$'

@auth_bp.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    
    # Validación de datos
    required_fields = ['nombre', 'apellido', 'nombre_usuario', 'email', 'celular', 'nacionalidad', 'pais_residencia', 'contrasena', 'espacio_asignado']
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
    id_rol = 3  # Manejar solo el rol 3, que es cliente
    espacio_asignado = data['espacio_asignado']
    if not re.match(email_regex, email):
        return jsonify({"Error": "El correo no tiene el formato adecuado"}), 400
    hashed_password = bcrypt.hashpw(contrasena.encode('utf-8'), bcrypt.gensalt())
    # Fecha de fin del periodo gratuito (3 meses desde la fecha actual)
    fecha_registro = datetime.now()
    fecha_fin_periodo_gratuito = fecha_registro + timedelta(days=90)
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "No se pudo establecer la conexión a la base de datos"}), 500
    cursor = conn.cursor()
    try:
        # Verificar si el nombre de usuario o el email ya existen
        cursor.execute('SELECT * FROM Usuarios WHERE nombre_usuario = ? OR email = ?', (nombre_usuario, email))
        user_exists = cursor.fetchone()
        if user_exists:
            return jsonify({"Error": "El nombre de usuario o correo electrónico ya existen"}), 409
        cursor.execute('''
            INSERT INTO Usuarios 
            (nombre, apellido, nombre_usuario, email, celular, nacionalidad, pais_residencia, contrasena, id_rol, espacio_asignado, fecha_registro, fecha_fin_periodo_gratuito)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (nombre, apellido, nombre_usuario, email, celular, nacionalidad, pais_residencia, hashed_password.decode('utf-8'), id_rol, espacio_asignado, fecha_registro, fecha_fin_periodo_gratuito))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Usuario registrado correctamente"}), 201
    except pyodbc.IntegrityError as e:
        # Manejar errores de integridad como violaciones de claves únicas
        return jsonify({"Error": "Error en la integridad de la base de datos: " + str(e)}), 400
    except Exception as e:
        # Manejar otros errores
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    if 'identificador' not in data or 'contrasena' not in data:
        return jsonify({"error": "Nombre de usuario/correo y contraseña son requeridos"}), 400
    identificador = data['identificador']  # Puede ser el nombre de usuario o el correo
    contrasena = data['contrasena']
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(''' 
        SELECT id_usuario, contrasena, id_rol, nombre_usuario, fecha_fin_periodo_gratuito 
        FROM Usuarios 
        WHERE email = ? OR nombre_usuario = ?
    ''', (identificador, identificador))
    user = cursor.fetchone()
    if user and bcrypt.checkpw(contrasena.encode('utf-8'), user[1].encode('utf-8')):
        # Verificar si la suscripción ha vencido
        fecha_fin_gratuito = user[4]
        if datetime.now() > fecha_fin_gratuito:
            # Actualizar la suscripción a vencida
            cursor.execute('UPDATE Usuarios SET suscripcion_vencida = 1 WHERE id_usuario = ?', (user[0],))
            conn.commit()
            return jsonify({"error": "Suscripción vencida. Por favor, realice el pago para continuar usando el servicio."}), 403

        # Actualizar la fecha del último login
        cursor.execute('UPDATE Usuarios SET fecha_ultimo_login = ? WHERE id_usuario = ?', (datetime.now(), user[0]))
        conn.commit()
        
        # Genera el token y envíalo en la respuesta
        token = jwt.encode({
            'id_usuario': user[0],
            'id_rol': user[2],  # Agregar el rol del usuario al token
            'nombre_usuario': user[3]
        }, current_app.config['SECRET_KEY'], algorithm='HS256')
        return jsonify({"message": "Login successful", "token": token}), 200
    else:
        return jsonify({"error": "Nombre de usuario/correo o contraseña son inválidos."}), 401

#solicitar el restablecimiento de contraseña
@auth_bp.route('/forgot_password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    if 'email' not in data and 'nombre_usuario' not in data:
        return jsonify({"error": "Correo o el Nombre de usuario es requerido"}), 400

    identifier = data.get('email') or data.get('nombre_usuario')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT id_usuario, email FROM Usuarios WHERE email = ? OR nombre_usuario = ?', (identifier, identifier))
    user = cursor.fetchone()

    if user:
        # Generar un token de restablecimiento (puedes usar una librería como `itsdangerous` para esto)
        reset_token = jwt.encode({'id_usuario': user[0]}, current_app.config['SECRET_KEY'], algorithm='HS256')

        # Enviar el correo de restablecimiento de contraseña
        enviar_correo_restablecimiento(user[1], reset_token)

        return jsonify({"message": "Restablecimiento de contraseña solicitado, revisa tu correo"}), 200
    else:
        return jsonify({"error": "Usuario no encontrado"}), 404

#Implementar la función para enviar el correo
def enviar_correo_restablecimiento(email, reset_token):
    # Configurar el servidor de correo
    mail_username = 'storegeayd@gmail.com',
    mail_password = 'crivntwwygipebja',
    mail_server = 'smtp.gmail.com',
    mail_port = 587

    # Crear el enlace de restablecimiento
    #reset_link = f"http://tu_dominio.com/reset_password?token={reset_token}"
    reset_link = f"http://localhost:5000/reset_password?token={reset_token}"
    # Crear el mensaje
    mensaje = MIMEMultipart()
    mensaje['From'] = mail_username
    mensaje['To'] = email
    mensaje['Subject'] = "Restablecimiento de Contraseña"

    # Cuerpo del correo
    cuerpo = f"""
    <p>Hola,</p>
    <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para hacerlo:</p>
    <p><a href="{reset_link}">Restablecer Contraseña</a></p>
    <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
    <p>Saludos,</p>
    <p>Tu equipo</p>
    """
    mensaje.attach(MIMEText(cuerpo, 'html'))

    try:
        # Enviar el correo
        with smtplib.SMTP(mail_server, mail_port) as server:
            server.starttls()  # Usar TLS
            server.login(mail_username, mail_password)  # Autenticarse
            server.send_message(mensaje)  # Enviar el mensaje

        print("Correo enviado correctamente.")
    except Exception as e:
        print(f"Error al enviar el correo: {e}")

#ruta para restablecer la contraseña
@auth_bp.route('/reset_password', methods=['POST'])
def reset_password():
    data = request.get_json()
    if 'token' not in data or 'nueva_contrasena' not in data:
        return jsonify({"error": "Token y nueva contraseña son requeridos"}), 400

    token = data['token']
    nueva_contrasena = data['nueva_contrasena']

    try:
        # Decodificar el token
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        id_usuario = payload['id_usuario']

        # Encriptar la nueva contraseña
        hashed_password = bcrypt.hashpw(nueva_contrasena.encode('utf-8'), bcrypt.gensalt())

        # Actualizar la contraseña en la base de datos
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('UPDATE Usuarios SET contrasena = ? WHERE id_usuario = ?', (hashed_password, id_usuario))
        conn.commit()

        return jsonify({"message": "Contraseña restablecida con éxito"}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "El token ha expirado"}), 400
    except jwt.InvalidTokenError:
        return jsonify({"error": "Token inválido"}), 400

# @auth_bp.route('/protected', methods=['GET'])
# @token_required
# def protected_route(current_user):
#     # La ruta solo se puede acceder si el token es válido
#     return jsonify({"message": f"Welcome, user {current_user}!"}), 200


# @auth_bp.route('/admin', methods=['GET'])
# @token_required
# @admin_required
# def admin_route(current_user):
#     print(current_user)
#     return jsonify({"message": f"Welcome admin, user {current_user['nombre_usuario']}!"}), 200


# @auth_bp.route('/empleado', methods=['GET'])
# @token_required
# @empleado_required
# def empleado_route(current_user):
#     return jsonify({"message": f"Welcome empleado, user {current_user['nombre_usuario']}!"}), 200


