

from datetime import datetime
from flask import Blueprint, jsonify, request,redirect
from app.connection import get_db_connection
from app.decorators import token_required




compartidos_bp = Blueprint('compartidos', __name__)
@compartidos_bp.route('/compartir_con', methods=['POST'])
@token_required

def compartir_con():
    try:
        datos = request.json
        id_carpeta = datos.get('id_carpeta')
        id_archivo = datos.get('id_archivo')
        id_usuario_propietario = datos.get('id_usuario_propietario')
        compartir_con = datos.get('compartir_con')
        conn = get_db_connection()
        cursor = conn.cursor()
        for id_usuario_destinatario in compartir_con:
            sql = '''
            INSERT INTO Compartidos (id_usuario_propietario, id_usuario_destinatario, id_carpeta, id_archivo, fecha_comparticion,estado)
            VALUES (?, , ?, ?, ?,?)
            '''
            cursor.execute(sql, (id_usuario_propietario, id_usuario_destinatario, id_carpeta,id_archivo, datetime.now(),'A'))
        conn.commit()
        cursor.close()
        conn.close()
        return {'mensaje': 'Archivos compartidos exitosamente'}, 201
    except Exception as e:
            return jsonify({"error": "Hubo un problema al compartir los archivos. Inténtalo nuevamente."}), 500
    
compartidos_bp = Blueprint('compartidos', __name__)
@compartidos_bp.route('/no_compartir_con', methods=['POST'])
#@token_required

def no_compartir_con():
    try:
        datos = request.json
        id_carpeta = datos.get('id_carpeta')
        id_archivo = datos.get('id_archivo')
        id_usuario_propietario = datos.get('id_usuario_propietario')
        no_compartir_con = datos.get('no_compartir_con')
        conn = get_db_connection()
        cursor = conn.cursor()

        if id_carpeta is not None:
            
            for id_usuario_destinatario in no_compartir_con:
                sql = '''
                UPDATE Compartidos
                SET estado = 'I'
                WHERE id_carpeta = ? AND id_usuario_propietario = ? AND id_usuario_destinatario = ?
                '''
                cursor.execute(sql, (id_carpeta, id_usuario_propietario, id_usuario_destinatario))
        
        if id_archivo is not None:
            
            for id_usuario_destinatario in no_compartir_con:
                sql = '''
                UPDATE Compartidos
                SET estado = I
                WHERE id_archivo = ? AND id_usuario_propietario = ? AND id_usuario_destinatario = ?
                '''
                cursor.execute(sql, (id_archivo, id_usuario_propietario, id_usuario_destinatario))
        
        
        if id_carpeta and id_archivo is not None:

            for id_usuario_destinatario in no_compartir_con:
                sql = '''
                UPDATE Compartidos
                SET estado = I
                WHERE id_carpeta = ? AND id_archivo = ? AND id_usuario_propietario = ? AND id_usuario_destinatario = ?
                '''
                cursor.execute(sql, (id_carpeta,id_archivo, id_usuario_propietario, id_usuario_destinatario))
        
        
        conn.commit()
        cursor.close()
        conn.close()
        return {'mensaje': 'Los archivos se dejaron de compartir exitosamente'}, 201
    except Exception as e:
            print("e",e)
            return jsonify({"error": "Hubo un problema al dejar de compartir los archivos. Inténtalo nuevamente."}), 500