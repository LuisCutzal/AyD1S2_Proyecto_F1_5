

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
@token_required

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
    

compartidos_bp = Blueprint('compartidos', __name__)
@compartidos_bp.route('/compartido_conmigo', methods=['POST'])
#@token_required
def compartido_conmigo():
    try:
        datos = request.json
        id_usuario = datos.get('id_usuario')
        conn = get_db_connection()
        cursor = conn.cursor()
        sql = '''
        SELECT COUNT(*) FROM Compartidos
        WHERE id_usuario_destinatario = ? AND estado = 'A';
        '''
        cursor.execute(sql, (id_usuario))
        archivos_quelecompartieron = cursor.fetchone()[0]
        if archivos_quelecompartieron > 0:
            sql = '''
            SELECT COUNT(*) FROM CARPETAS
            WHERE ID_USUARIO_PROPIETARIO = ? AND ID_CARPETA_AUX = 19;
            '''
            cursor.execute(sql, (id_usuario))
            existe_carpeta_compartida = cursor.fetchone()[0]  # Obtienes el primer valor del resultado
            
            if existe_carpeta_compartida > 0:
                sql = '''
                UPDATE Carpetas SET visible = 1 
                WHERE id_usuario_propietario = ? and id_carpeta_aux = 19;
                '''
                cursor.execute(sql, (id_usuario))
                conn.commit()

                return jsonify({"sucess": "Se coloco visible la carpeta compartidos conmigo."}), 200
                
            else:
                
                cursor.execute('''
                    INSERT INTO Carpetas (nombre_carpeta, id_usuario_propietario, id_carpeta_aux,visible)
                    VALUES (?, ?, ?,?)
                ''', ('Compartido Conmigo',id_usuario,19,1))
                conn.commit()
                
                return jsonify({"sucess": "Se creo la carpeta compartidos conmigo."}), 200
            
        else:
            sql = '''
            UPDATE Carpetas SET visible = 0 
            WHERE id_usuario_propietario = ? and id_carpeta_aux = 19;
            '''
            cursor.execute(sql, (id_usuario))
            conn.commit()
            return jsonify({"sucess": "No tiene archivos compartidos."}), 200
             
        #SI NO HAY CARPETAS NI ARCHIVOS COMPARTIDOS OCULTAR CARPETA COMPARTIDO CONMIGO
        #SI HAY UN ARCHIVO VALIDAR QUE EXISTA LA CARPETA SINO EXISTE CREAR LA CARPETA
        #SI HAY UN ARCHIVO Y YA EXISTE SOLO VALIDAR QUE TENGA EL ESTADO VISIBLE

        #LA CARPETA DEBE ESTAR MAPEADA POR EL USUARIO DESTINATARIO Y ALGUN CODIGO DE CARPETA
        return jsonify({"sucess": "Se crea la carpeta compartidos conmigo."}), 200
    except Exception as e:
            print("e",e)
            return jsonify({"error": "Hubo un problema al crear la carpeta compartidos conmigo. Inténtalo nuevamente."}), 500
