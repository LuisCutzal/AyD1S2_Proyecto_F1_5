

from datetime import datetime
from flask import Blueprint, jsonify, request,redirect
from app.connection import get_db_connection
from app.decorators import token_required




compartidos_bp = Blueprint('compartidos', __name__)
#crear capeta
@compartidos_bp.route('/compartir', methods=['POST'])
#@token_required

def compartir():

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
            VALUES (?, ?, ?, ?, ?,?)
            '''
            # Insertar id_carpeta_archivo en la columna correspondiente a id_carpeta
            cursor.execute(sql, (id_usuario_propietario, id_usuario_destinatario, id_carpeta,id_archivo, datetime.now(),'A'))


    # Confirmar las inserciones en la base de datos
        conn.commit()

        cursor.close()
        conn.close()

        return {'mensaje': 'Archivos compartidos exitosamente'}, 201
    except Exception as e:
            # Manejar cualquier excepción que ocurra y hacer rollback en caso de error
            #conn.rollback()
            print("e" , e)
            return jsonify({"error": "Hubo un problema al compartir los archivos. Inténtalo nuevamente."}), 500