from flask import Blueprint, jsonify, request
from app.connection import get_db_connection
from app.decorators import token_required, cliente_required
import os
from werkzeug.utils import secure_filename

cliente_bp = Blueprint('cliente', __name__)

@cliente_bp.route('/dashboard', methods=['GET']) #dashbord para el administrador
@token_required
@cliente_required
def cliente_route(current_user):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Obtener las carpetas y archivos del usuario
    cursor.execute('''
        SELECT id_carpeta, nombre_carpeta, id_carpeta_padre
        FROM Carpetas
        WHERE id_usuario_propietario = ? AND en_papelera = 0
    ''', (current_user['id_usuario'],))
    carpetas = cursor.fetchall()

    cursor.execute('''
        SELECT id_archivo, nombre_archivo, id_carpeta, tamano_mb
        FROM Archivos
        WHERE id_usuario_propietario = ? AND en_papelera = 0
    ''', (current_user['id_usuario'],))
    archivos = cursor.fetchall()

    # Obtener información del espacio del usuario
    cursor.execute('''
        SELECT espacio_asignado, espacio_ocupado 
        FROM Usuarios 
        WHERE id_usuario = ?
    ''', (current_user['id_usuario'],))
    usuario_info = cursor.fetchone()

    if usuario_info:
        espacio_total = usuario_info.espacio_asignado
        espacio_usado = usuario_info.espacio_ocupado
        espacio_libre = espacio_total - espacio_usado
    else:
        espacio_total = 0
        espacio_usado = 0
        espacio_libre = 0

    # Construir la respuesta en JSON con carpetas, archivos y la información del espacio
    return jsonify({
        'carpetas': [{'id_carpeta': c.id_carpeta, 'nombre': c.nombre_carpeta, 'padre': c.id_carpeta_padre} for c in carpetas],
        'archivos': [{'id_archivo': a.id_archivo, 'nombre': a.nombre_archivo, 'carpeta': a.id_carpeta, 'tamano_mb': a.tamano_mb} for a in archivos],
        'espacio_total': espacio_total,
        'espacio_usado': espacio_usado,
        'espacio_libre': espacio_libre
    })


#crear capeta
@cliente_bp.route('/carpeta', methods=['POST'])
@token_required
@cliente_required
def crear_carpeta(current_user):
    datos = request.json
    nombre_carpeta = datos.get('nombre_carpeta')
    id_carpeta_padre = datos.get('id_carpeta_padre')  # Puede ser NULL para la raíz
    conn = get_db_connection()
    cursor = conn.cursor()

    # Verificar si la carpeta padre existe, si se especifica
    if id_carpeta_padre is not None:
        cursor.execute('''
            SELECT id_carpeta 
            FROM Carpetas 
            WHERE id_carpeta = ? AND id_usuario_propietario = ?
        ''', (id_carpeta_padre, current_user['id_usuario']))
        carpeta_padre = cursor.fetchone()

        if not carpeta_padre:
            return jsonify({'error': 'La carpeta padre no existe.'}), 400

    # Crear carpeta para el usuario
    cursor.execute('''
        INSERT INTO Carpetas (nombre_carpeta, id_usuario_propietario, id_carpeta_padre)
        VALUES (?, ?, ?)
    ''', (nombre_carpeta, current_user['id_usuario'], id_carpeta_padre))
    conn.commit()
    return jsonify({'message': 'Carpeta creada correctamente'}), 201

# Eliminar carpeta
@cliente_bp.route('/carpeta/<int:id_carpeta>', methods=['DELETE'])
@token_required
@cliente_required
def eliminar_carpeta(current_user, id_carpeta):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Verificar si la carpeta existe
    cursor.execute('''
        SELECT id_carpeta 
        FROM Carpetas 
        WHERE id_carpeta = ? AND id_usuario_propietario = ?
    ''', (id_carpeta, current_user['id_usuario']))
    carpeta = cursor.fetchone()

    if not carpeta:
        return jsonify({'error': 'La carpeta no existe.'}), 404

    # Mover archivos dentro de la carpeta a la papelera
    cursor.execute('''
        UPDATE Archivos
        SET en_papelera = 1
        WHERE id_carpeta = ? AND id_usuario_propietario = ?
    ''', (id_carpeta, current_user['id_usuario']))

    # Mover subcarpetas a la papelera
    cursor.execute('''
        UPDATE Carpetas
        SET en_papelera = 1
        WHERE id_carpeta_padre = ? AND id_usuario_propietario = ?
    ''', (id_carpeta, current_user['id_usuario']))

    # Mover la carpeta a la papelera
    cursor.execute('''
        UPDATE Carpetas
        SET en_papelera = 1
        WHERE id_carpeta = ? AND id_usuario_propietario = ?
    ''', (id_carpeta, current_user['id_usuario']))
    
    conn.commit()
    return jsonify({'message': 'Carpeta eliminada correctamente'}), 200


# Modificar nombre carpeta
@cliente_bp.route('/carpeta/<int:id_carpeta>', methods=['PUT'])
@token_required
@cliente_required
def modificar_carpeta(current_user, id_carpeta):
    datos = request.json
    nuevo_nombre = datos.get('nombre_carpeta')

    conn = get_db_connection()
    cursor = conn.cursor()

    # Verificar si la carpeta existe y no está en papelera
    cursor.execute(''' 
        SELECT en_papelera 
        FROM Carpetas 
        WHERE id_carpeta = ? AND id_usuario_propietario = ?
    ''', (id_carpeta, current_user['id_usuario']))
    carpeta_info = cursor.fetchone()

    if carpeta_info is None:
        return jsonify({'error': 'La carpeta no existe.'}), 404

    if carpeta_info.en_papelera == 1:
        return jsonify({'error': 'La carpeta está en papelera o no existe y no puede ser modificada.'}), 400

    # Modificar nombre de la carpeta
    cursor.execute('''
        UPDATE Carpetas
        SET nombre_carpeta = ?
        WHERE id_carpeta = ? AND id_usuario_propietario = ?
    ''', (nuevo_nombre, id_carpeta, current_user['id_usuario']))
    conn.commit()

    return jsonify({'message': 'Carpeta modificada correctamente'}), 200


# Ruta donde se almacenarán los archivos
UPLOAD_FOLDER = 'C:\\Users\\cutza\\Desktop\\usac\\2024\\SegundoSemestre2024\\AyD\\lab\\pruebasubidas'

@cliente_bp.route('/archivo/subir', methods=['POST'])
@token_required
@cliente_required
def subir_archivo(current_user):
    if 'archivo' not in request.files:
        return jsonify({'error': 'No se ha enviado ningún archivo.'}), 400
    archivo = request.files['archivo']
    if archivo.filename == '':
        return jsonify({'error': 'Nombre de archivo no válido.'}), 400
    
    datos = request.form
    id_carpeta = datos.get('id_carpeta')
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if id_carpeta:
        # Verificar si la carpeta existe y pertenece al usuario
        cursor.execute('''
            SELECT id_carpeta, nombre_carpeta
            FROM Carpetas
            WHERE id_carpeta = ? AND id_usuario_propietario = ? AND en_papelera = 0
        ''', (id_carpeta, current_user['id_usuario']))
        carpeta = cursor.fetchone()
        
        if not carpeta:
            return jsonify({'error': 'La carpeta no existe o no pertenece al usuario.'}), 404
        
        # Usar 'carpeta[1]' para obtener el nombre de la carpeta
        ruta_carpeta = os.path.join(UPLOAD_FOLDER, carpeta[1])  # Aquí se usa 'carpeta[1]' (nombre_carpeta)
        
        # Crear la carpeta en el sistema de archivos si no existe
        if not os.path.exists(ruta_carpeta):
            os.makedirs(ruta_carpeta)
        
        # Guardar el archivo en la carpeta especificada
        ruta_archivo = os.path.join(ruta_carpeta, secure_filename(archivo.filename))
    
    else:
        # Si no se proporciona carpeta, guardar en la raíz (UPLOAD_FOLDER)
        ruta_archivo = os.path.join(UPLOAD_FOLDER, secure_filename(archivo.filename))
    
    # Guardar el archivo en la ruta generada
    archivo.save(ruta_archivo)
    
    # Obtener el tamaño del archivo en MB
    tamano_archivo_mb = obtener_tamano(archivo)  # Asegúrate de que 'obtener_tamano' esté definido correctamente
    
    # Insertar el archivo en la base de datos
    cursor.execute('''
        INSERT INTO Archivos (nombre_archivo, id_usuario_propietario, id_carpeta, tamano_mb)
        VALUES (?, ?, ?, ?)
    ''', (secure_filename(archivo.filename), current_user['id_usuario'], id_carpeta, tamano_archivo_mb))
    
    # Sumar el tamaño del archivo al espacio ocupado del usuario
    cursor.execute('''
        UPDATE Usuarios
        SET espacio_ocupado = espacio_ocupado + ?
        WHERE id_usuario = ?
    ''', (tamano_archivo_mb, current_user['id_usuario']))

    # Guardar los cambios en la base de datos
    conn.commit()

    return jsonify({'message': 'Archivo subido exitosamente.'}), 201


def obtener_tamano(archivo):
    """
    Calcula el tamaño del archivo en MB.
    """
    archivo.seek(0, os.SEEK_END)  # Mover el puntero al final
    tamano = archivo.tell() / (1024 * 1024)  # Obtener tamaño en MB
    archivo.seek(0)  # Volver al principio
    return tamano