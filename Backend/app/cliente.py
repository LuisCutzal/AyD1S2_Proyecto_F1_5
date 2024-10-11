from flask import Blueprint, jsonify, request,redirect
from app.connection import get_db_connection
from app.decorators import token_required, cliente_required
import os
from werkzeug.utils import secure_filename
from app.cargaBuket import uploadFileBucket ,download_file_from_s3
from datetime import datetime
from cryptography.fernet import Fernet
from flask import jsonify, request
from io import BytesIO
from werkzeug.exceptions import BadRequest
cliente_bp = Blueprint('cliente', __name__)

@cliente_bp.route('/dashboard', methods=['GET'])  
@token_required
@cliente_required
def cliente_route(current_user):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Obtener las carpetas y archivos del usuario
        try:
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
                espacio_total = usuario_info[0]
                espacio_usado = usuario_info[1]
                espacio_libre = espacio_total - espacio_usado
            else:
                espacio_total = 0
                espacio_usado = 0
                espacio_libre = 0

            return jsonify({
                'carpetas': [{'id_carpeta': c[0], 'nombre': c[1], 'padre': c[2]} for c in carpetas],
                'archivos': [{'id_archivo': a[0], 'nombre': a[1], 'carpeta': a[2], 'tamano_mb': a[3]} for a in archivos],
                'espacio_total': espacio_total,
                'espacio_usado': espacio_usado,
                'espacio_libre': espacio_libre
            })

        except Exception as e:
            return jsonify({'error': 'Error en la base de datos'}), 500

    except Exception as e:
        return jsonify({'error': 'Error en la conexión a la base de datos'}), 500

    finally:
        try:
            cursor.close()
            conn.close()  # Asegúrate de cerrar siempre la conexión
        except:
            pass  # Opcionalmente maneja errores de cierre aquí

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
#UPLOAD_FOLDER = 'C:\\Users\\cutza\\Desktop\\usac\\2024\\SegundoSemestre2024\\AyD\\lab\\pruebasubidas'
# no usar upload folder y borrar todo lo que tenga que ver con eso 
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
    id_carpeta = int(datos.get('id_carpeta')) if datos.get('id_carpeta') else None
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Obtener el tamaño del archivo en MB antes de subirlo
    tamano_mb_mb = obtener_tamano(archivo)
    
    # Separar el nombre del archivo de su extensión
    nombre_archivo, extension = os.path.splitext(secure_filename(archivo.filename))
    
    # Generar timestamp
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_%f')
    
    # Unir el nombre del archivo con el timestamp antes de la extensión
    nuevo_nombre_archivo = f"{nombre_archivo}_{timestamp}{extension}"
    
    if id_carpeta:
        cursor.execute('''
            SELECT id_carpeta, nombre_carpeta
            FROM Carpetas
            WHERE id_carpeta = ? AND id_usuario_propietario = ? AND en_papelera = 0
        ''', (id_carpeta, current_user['id_usuario']))
        carpeta = cursor.fetchone()
        
        if not carpeta:
            return jsonify({'error': 'La carpeta no existe o no pertenece al usuario.'}), 404

        # Generar ruta del archivo en la carpeta
        ruta_archivo_bucket = f"{carpeta[1]}/{nuevo_nombre_archivo}"
        url_archivo = uploadFileBucket(archivo, ruta_archivo_bucket)

    else:
        # Subir a la raíz del bucket si no hay carpeta
        url_archivo = uploadFileBucket(archivo, nuevo_nombre_archivo)

    if not url_archivo:
        return jsonify({'error': 'Error al subir el archivo al bucket de AWS.'}), 500

    # Insertar los datos del archivo en la base de datos
    cursor.execute('''
        INSERT INTO Archivos (nombre_archivo, id_usuario_propietario, id_carpeta, tamano_mb, url_archivo)
        VALUES (?, ?, ?, ?, ?)
    ''', (nuevo_nombre_archivo, current_user['id_usuario'], id_carpeta, tamano_mb_mb, url_archivo))

    # Actualizar espacio ocupado del usuario
    cursor.execute('''
        UPDATE Usuarios
        SET espacio_ocupado = espacio_ocupado + ?
        WHERE id_usuario = ?
    ''', (tamano_mb_mb, current_user['id_usuario']))

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


# @cliente_bp.route('/archivo/descargar/<int:id_archivo>', methods=['GET'])
# @token_required
# @cliente_required
# def descargar_archivo(current_user, id_archivo):
#     conn = get_db_connection()
#     cursor = conn.cursor()
    
#     try:
#         # Verificar si el archivo existe y pertenece al usuario
#         cursor.execute(''' 
#             SELECT nombre_archivo 
#             FROM Archivos 
#             WHERE id_archivo = ? AND id_usuario_propietario = ? AND en_papelera = 0
#         ''', (id_archivo, current_user['id_usuario']))
#         archivo = cursor.fetchone()

#         if archivo is None:
#             return jsonify({'error': 'Archivo no encontrado.'}), 404

#         # Acceder al nombre del archivo desde la tupla
#         nombre_archivo = archivo[0]  # Accediendo al primer (y único) elemento de la tupla
#         ruta_archivo = os.path.join(UPLOAD_FOLDER, nombre_archivo)

#         return send_file(ruta_archivo, as_attachment=True)
#     finally:
#         cursor.close()
#         conn.close()  # Asegúrate de cerrar la conexión



#eliminar archivo
@cliente_bp.route('/archivo/eliminar/<int:id_archivo>', methods=['DELETE'])
@token_required
@cliente_required
def eliminar_archivo(current_user, id_archivo):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE Archivos
        SET en_papelera = 1
        WHERE id_archivo = ? AND id_usuario_propietario = ?
    ''', (id_archivo, current_user['id_usuario']))

    if cursor.rowcount == 0:
        return jsonify({'error': 'Archivo no encontrado.'}), 404

    conn.commit()
    return jsonify({'message': 'Archivo movido a la papelera.'}), 200

#modificar archvio
@cliente_bp.route('/archivo/modificar/<int:id_archivo>', methods=['PUT'])
@token_required
@cliente_required
def modificar_archivo(current_user, id_archivo):
    datos = request.json
    nuevo_nombre = datos.get('nombre_archivo')
    
    if not nuevo_nombre:
        return jsonify({'error': 'El nuevo nombre del archivo es requerido.'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Verificar si el archivo existe y pertenece al usuario
    cursor.execute('''
        SELECT nombre_archivo, en_papelera 
        FROM Archivos 
        WHERE id_archivo = ? AND id_usuario_propietario = ?
    ''', (id_archivo, current_user['id_usuario']))
    
    archivo = cursor.fetchone()
    
    if archivo is None:
        return jsonify({'error': 'Archivo no encontrado.'}), 404

    if archivo[1] == 1:  # Verificar si está en papelera
        return jsonify({'error': 'El archivo está en papelera y no puede ser modificado.'}), 400
    
    # Extraer la extensión del archivo existente
    nombre_viejo = archivo[0]
    extension = os.path.splitext(nombre_viejo)[1]  # Obtener la extensión

    # Obtener la fecha y hora actual para agregar al nombre
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_%f')

    # Generar el nuevo nombre con el timestamp
    nombre_nuevo = f"{secure_filename(nuevo_nombre)}_{timestamp}{extension}"

    # Actualizar solo el nombre en la base de datos
    cursor.execute('''
        UPDATE Archivos 
        SET nombre_archivo = ? 
        WHERE id_archivo = ? AND id_usuario_propietario = ?
    ''', (nombre_nuevo, id_archivo, current_user['id_usuario']))

    conn.commit()
    
    return jsonify({'message': 'Nombre del archivo modificado correctamente en la base de datos.', 'nuevo_nombre': nombre_nuevo}), 200

#vaciar papelera
@cliente_bp.route('/papelera/vaciar', methods=['DELETE'])
@token_required
@cliente_required
def vaciar_papelera(current_user):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Obtener los archivos en la papelera del usuario
    cursor.execute('''
        SELECT id_archivo, nombre_archivo, tamano_mb 
        FROM Archivos 
        WHERE id_usuario_propietario = ? AND en_papelera = 1
    ''', (current_user['id_usuario'],))
    
    archivos = cursor.fetchall()
    total_tamano = sum(archivo.tamano_mb for archivo in archivos)

    # Eliminar archivos de la base de datos
    for archivo in archivos:
        id_archivo = archivo.id_archivo
        
        cursor.execute('''
            DELETE FROM Archivos 
            WHERE id_archivo = ? 
        ''', (id_archivo,))

    # Obtener las carpetas en la papelera del usuario
    cursor.execute('''
        SELECT id_carpeta 
        FROM Carpetas 
        WHERE id_usuario_propietario = ? AND en_papelera = 1
    ''', (current_user['id_usuario'],))
    
    carpetas = cursor.fetchall()

    # Eliminar carpetas de la base de datos
    for carpeta in carpetas:
        cursor.execute('''
            DELETE FROM Carpetas 
            WHERE id_carpeta = ? 
        ''', (carpeta.id_carpeta,))

    # Actualizar el espacio ocupado del usuario
    cursor.execute('''
        UPDATE Usuarios 
        SET espacio_ocupado = espacio_ocupado - ? 
        WHERE id_usuario = ?
    ''', (total_tamano, current_user['id_usuario']))

    conn.commit()
    return jsonify({'message': 'Papelera vaciada correctamente.'}), 200



# modificar datos del usuario

@cliente_bp.route('/perfil/modificar', methods=['PUT'])
@token_required
@cliente_required
def modificar_perfil(current_user):
    if not current_user:
        return jsonify({'error': 'El usuario no existe.'}), 404  # Asegúrate de que este mensaje sea correcto
    datos = request.json
    nombre = datos.get('nombre')
    apellido = datos.get('apellido')
    nombre_usuario = datos.get('nombre_usuario')
    email = datos.get('email')
    celular = datos.get('celular')
    nacionalidad = datos.get('nacionalidad')
    pais_residencia = datos.get('pais_residencia')
    contrasena = datos.get('contrasena')

    conn = None
    cursor = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Actualizar solo los campos proporcionados
        if nombre:
            cursor.execute('''UPDATE Usuarios SET nombre = ? WHERE id_usuario = ?''', (nombre, current_user['id_usuario']))
        if apellido:
            cursor.execute('''UPDATE Usuarios SET apellido = ? WHERE id_usuario = ?''', (apellido, current_user['id_usuario']))
        if nombre_usuario:
            cursor.execute('''UPDATE Usuarios SET nombre_usuario = ? WHERE id_usuario = ?''', (nombre_usuario, current_user['id_usuario']))
        if email:
            cursor.execute('''UPDATE Usuarios SET email = ? WHERE id_usuario = ?''', (email, current_user['id_usuario']))
        if celular:
            cursor.execute('''UPDATE Usuarios SET celular = ? WHERE id_usuario = ?''', (celular, current_user['id_usuario']))
        if nacionalidad:
            cursor.execute('''UPDATE Usuarios SET nacionalidad = ? WHERE id_usuario = ?''', (nacionalidad, current_user['id_usuario']))
        if pais_residencia:
            cursor.execute('''UPDATE Usuarios SET pais_residencia = ? WHERE id_usuario = ?''', (pais_residencia, current_user['id_usuario']))
        if contrasena:
            cursor.execute('''UPDATE Usuarios SET contrasena = ? WHERE id_usuario = ?''', (contrasena, current_user['id_usuario']))

        conn.commit()

    except Exception as e:
        if conn:
            conn.rollback()  # Revertir los cambios en caso de error
        return jsonify({'error': 'Error al modificar el perfil: ' + str(e)}), 500

    finally:
        if cursor:
            cursor.close()  # Asegúrate de cerrar el cursor
        if conn:
            conn.close()  # Asegúrate de cerrar la conexión

    return jsonify({'message': 'Perfil modificado correctamente.'}), 200


@cliente_bp.route('/solicitar/espacio', methods=['POST'])
@token_required
@cliente_required
def solicitar_espacio(current_user):
    datos = request.json
    tipo_solicitud = datos.get('tipo_solicitud')  # 'expandir' o 'reducir'
    cantidad = datos.get('cantidad')

    if tipo_solicitud not in ['expandir', 'reducir']:
        return jsonify({'error': 'Tipo de solicitud inválido.'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Insertar la solicitud en la base de datos
    cursor.execute('''
        INSERT INTO SolicitudesEspacio (id_usuario, tipo_solicitud, cantidad)
        VALUES (?, ?, ?)
    ''', (current_user['id_usuario'], tipo_solicitud, cantidad))
    conn.commit()

    return jsonify({'message': 'Solicitud de espacio realizada correctamente.'}), 201

#fase2

@cliente_bp.route('/archivos/<int:id_archivo>/previsualizar', methods=['GET'])
@token_required
@cliente_required
def previsualizar_archivo(current_user, id_archivo):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute('''
            SELECT url_archivo
            FROM Archivos
            WHERE id_archivo = ? AND id_usuario_propietario = ?
        ''', (id_archivo, current_user['id_usuario']))
        
        archivo = cursor.fetchone()
        
        if archivo:
            url_archivo = archivo[0]
            return jsonify({'url_archivo': url_archivo}), 200  # Enviar URL al front-end
        else:
            return jsonify({'error': 'Archivo no encontrado'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        cursor.close()
        conn.close()


@cliente_bp.route('/favoritos', methods=['GET'])
@token_required
@cliente_required
def obtener_favoritos(current_user):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Obtener las carpetas favoritas del usuario
        cursor.execute('''
            SELECT f.id_favorito, c.id_carpeta, c.nombre_carpeta, c.id_carpeta_padre
            FROM Favoritos f
            JOIN Carpetas c ON f.id_carpeta = c.id_carpeta
            WHERE f.id_usuario = ? AND f.id_carpeta IS NOT NULL
        ''', (current_user['id_usuario'],))
        carpetas_favoritas = cursor.fetchall()

        # Obtener los archivos favoritos del usuario
        cursor.execute('''
            SELECT f.id_favorito, a.id_archivo, a.nombre_archivo, a.tamano_mb, a.id_carpeta
            FROM Favoritos f
            JOIN Archivos a ON f.id_archivo = a.id_archivo
            WHERE f.id_usuario = ? AND f.id_archivo IS NOT NULL
        ''', (current_user['id_usuario'],))
        archivos_favoritos = cursor.fetchall()

        return jsonify({
            'carpetas_favoritas': [{'id_favorito': c[0], 'id_carpeta': c[1], 'nombre_carpeta': c[2], 'id_carpeta_padre': c[3]} for c in carpetas_favoritas],
            'archivos_favoritos': [{'id_favorito': a[0], 'id_archivo': a[1], 'nombre_archivo': a[2], 'tamano_mb': a[3], 'id_carpeta': a[4]} for a in archivos_favoritos]
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        cursor.close()
        conn.close()


@cliente_bp.route('/favoritos/agregar', methods=['POST'])
@token_required
@cliente_required
def agregar_favorito(current_user):
    try:
        data = request.json  # Obtener los datos del cuerpo de la petición
        id_archivo = data.get('id_archivo')
        id_carpeta = data.get('id_carpeta')

        # Validar que uno de los dos esté presente y que no se envíen ambos
        if not id_archivo and not id_carpeta:
            return jsonify({'error': 'Debe proporcionar un id de archivo o carpeta para agregar a favoritos'}), 400

        if id_archivo and id_carpeta:
            return jsonify({'error': 'Solo puede agregar un archivo o una carpeta a la vez, no ambos'}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Verificar que el archivo o carpeta pertenezca al usuario
        if id_archivo:
            cursor.execute('''
                SELECT id_archivo
                FROM Archivos
                WHERE id_archivo = ? AND id_usuario_propietario = ?
            ''', (id_archivo, current_user['id_usuario']))
            archivo = cursor.fetchone()

            if not archivo:
                return jsonify({'error': 'Archivo no encontrado'}), 404

            # Verificar si el archivo ya está en favoritos
            cursor.execute('''
                SELECT id_favorito
                FROM Favoritos
                WHERE id_usuario = ? AND id_archivo = ?
            ''', (current_user['id_usuario'], id_archivo))
            favorito_existente = cursor.fetchone()

            if favorito_existente:
                return jsonify({'error': 'El archivo ya está en favoritos'}), 400

        if id_carpeta:
            cursor.execute('''
                SELECT id_carpeta
                FROM Carpetas
                WHERE id_carpeta = ? AND id_usuario_propietario = ?
            ''', (id_carpeta, current_user['id_usuario']))
            carpeta = cursor.fetchone()

            if not carpeta:
                return jsonify({'error': 'Carpeta no encontrada'}), 404

            # Verificar si la carpeta ya está en favoritos
            cursor.execute('''
                SELECT id_favorito
                FROM Favoritos
                WHERE id_usuario = ? AND id_carpeta = ?
            ''', (current_user['id_usuario'], id_carpeta))
            favorito_existente = cursor.fetchone()

            if favorito_existente:
                return jsonify({'error': 'La carpeta ya está en favoritos'}), 400

        # Agregar a favoritos
        cursor.execute('''
            INSERT INTO Favoritos (id_usuario, id_archivo, id_carpeta)
            VALUES (?, ?, ?)
        ''', (current_user['id_usuario'], id_archivo, id_carpeta))
        conn.commit()

        return jsonify({'message': 'Favorito agregado exitosamente'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        cursor.close()
        conn.close()


from io import BytesIO
from cryptography.fernet import Fernet
from flask import jsonify, request
from werkzeug.exceptions import BadRequest

# Generar una clave de cifrado
def generar_clave():
    return Fernet.generate_key()

# Función para cifrar datos en memoria
def cifrar_datos(datos, clave):
    fernet = Fernet(clave)
    return fernet.encrypt(datos)

# Endpoint para crear un backup cifrado
@cliente_bp.route('/backups/cifrar', methods=['POST'])
@token_required
@cliente_required
def crear_backup_cifrado(current_user):
    try:
        data = request.json
        id_archivo = data.get('id_archivo')
        nombre_backup = data.get('nombre_backup')

        if not id_archivo or not nombre_backup:
            return jsonify({'error': 'Debe proporcionar id_archivo y nombre_backup'}), 400

        # Verificar que el archivo pertenezca al usuario
        conn = get_db_connection()
        cursor = conn.cursor()

        # Obtener la URL del archivo desde la base de datos
        cursor.execute('''SELECT id_archivo, url_archivo, tamano_mb 
                        FROM Archivos 
                        WHERE id_archivo = ? AND id_usuario_propietario = ?''',
                    (id_archivo, current_user['id_usuario']))
        archivo = cursor.fetchone()

        if not archivo:
            return jsonify({'error': 'Archivo no encontrado o no pertenece al usuario'}), 404

        # Extraer el nombre del archivo de la URL
        nombre_archivo = archivo[1].split('/')[-1]  # Obtener solo el nombre del archivo
        print(nombre_archivo)
        # Descargar el archivo desde S3 usando el nombre extraído
        archivo_obj = download_file_from_s3(nombre_archivo)  # Pasa solo el nombre del archivo
        
        # Generar una nueva clave de cifrado
        clave_cifrado = generar_clave()
        
        # Cifrar los datos del archivo
        archivo_cifrado = cifrar_datos(archivo_obj.read(), clave_cifrado)

        # Generar un timestamp para el nombre del archivo
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_%f')  # Formato: YYYYMMDD_HHMMSS_mili
        s3fileName = f"{nombre_backup}_{timestamp}.enc"  # Modificar el nombre del archivo

        # Subir el archivo cifrado a S3
        archivo_cifrado_obj = BytesIO(archivo_cifrado)
        archivo_cifrado_obj.seek(0)  # Asegurarse de estar al principio del archivo
        url_backup = uploadFileBucket(archivo_cifrado_obj, s3fileName)

        # Guardar información del backup en la base de datos
        tamanio_backup = len(archivo_cifrado)  # Obtener el tamaño del backup
        cursor.execute('''INSERT INTO Backups_Cifrados 
                          (id_usuario, id_archivo, nombre_backup, ruta_backup, clave_cifrado, tamanio_backup) 
                          VALUES (?, ?, ?, ?, ?, ?)''',
                       (current_user['id_usuario'], archivo[0], nombre_backup, url_backup, clave_cifrado.decode(), tamanio_backup))
        conn.commit()

        return jsonify({
            'message': 'Backup cifrado creado exitosamente',
            'url': url_backup,
            'claveDescifrado': clave_cifrado.decode()  # Incluir la clave de cifrado en la respuesta
        }), 201

    except BadRequest as e:
        return jsonify({'error': str(e)}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        cursor.close()
        conn.close()