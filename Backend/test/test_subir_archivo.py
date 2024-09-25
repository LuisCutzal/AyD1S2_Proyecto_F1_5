import unittest
from unittest import mock
from flask import Flask, jsonify
from werkzeug.datastructures import FileStorage
import jwt
import os
from app.cliente import cliente_bp
from io import BytesIO

class TestSubirArchivo(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.config['TESTING'] = True
        self.app.config['SECRET_KEY'] = 'test_secret_key'
        self.app.config['UPLOAD_FOLDER'] = 'C:\\Users\\cutza\\Desktop\\usac\\2024\\SegundoSemestre2024\\AyD\\lab\\pruebasubidas'
        self.app.register_blueprint(cliente_bp)
        self.client = self.app.test_client()

    @mock.patch('app.decorators.token_required')
    @mock.patch('app.decorators.cliente_required')
    @mock.patch('app.cliente.get_db_connection')
    def test_subir_archivo(self, mock_get_db_connection, mock_cliente_required, mock_token_required):
        # Simular decoradores
        mock_token_required.return_value = lambda f: f
        mock_cliente_required.return_value = lambda f: f

        # Crear un token para el usuario cliente
        token = jwt.encode({'id_usuario': 12, 'id_rol': 3, 'nombre_usuario': 'mlopez'}, 
                        self.app.config['SECRET_KEY'], algorithm='HS256')
        headers = {'Authorization': f'Bearer {token}'}

        # Crear un archivo simulado
        data = {
            'archivo': (BytesIO(b'Contenido del archivo'), 'archivo_test.txt'),
            'id_carpeta': 1  # Asegúrate de que es un entero
        }

        # Simular la conexión y el cursor de la base de datos
        mock_conn = mock.Mock()
        mock_cursor = mock.Mock()
        mock_get_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Simular que la carpeta existe
        mock_cursor.fetchone.return_value = (1, 'carpeta_test')  # id_carpeta, nombre_carpeta

        # Realizar la petición POST
        response = self.client.post('/archivo/subir', data=data, headers=headers, content_type='multipart/form-data')

        # Verificar que la respuesta sea la esperada
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.get_json(), {'message': 'Archivo subido exitosamente.'})

        # Verificar las consultas a la base de datos
        expected_calls = [
            ('SELECT id_carpeta, nombre_carpeta FROM Carpetas WHERE id_carpeta = ? AND id_usuario_propietario = ? AND en_papelera = 0', (1, 12)),
            ('INSERT INTO Archivos (nombre_archivo, id_usuario_propietario, id_carpeta, tamano_mb) VALUES (?, ?, ?, ?)', ('archivo_test.txt', 12, 1, mock.ANY)),
            ('UPDATE Usuarios SET espacio_ocupado = espacio_ocupado + ? WHERE id_usuario = ?', (mock.ANY, 12))
        ]

        # Debugging: Verificar las llamadas a mock_cursor.execute
        print("Llamadas a mock_cursor.execute:")
        for call in mock_cursor.execute.call_args_list:
            print(call)

        # Verificar las consultas SQL esperadas
        for call, expected_call in zip(mock_cursor.execute.call_args_list, expected_calls):
            # Eliminar saltos de línea y espacios adicionales para comparación exacta
            actual_query = call[0][0].replace('\n', '').replace(' ', '')
            expected_query = expected_call[0].replace('\n', '').replace(' ', '')
            self.assertEqual(actual_query, expected_query)  # Comprobar la consulta SQL
            self.assertEqual(call[0][1], expected_call[1])  # Comprobar los parámetros

    @mock.patch('app.decorators.token_required')
    @mock.patch('app.decorators.cliente_required')
    @mock.patch('app.cliente.get_db_connection')
    def test_subir_archivo_sin_carpeta(self, mock_get_db_connection, mock_cliente_required, mock_token_required):
        # Simular decoradores
        mock_token_required.return_value = lambda f: f
        mock_cliente_required.return_value = lambda f: f

        # Crear un token para el usuario cliente
        token = jwt.encode({'id_usuario': 12, 'id_rol': 3, 'nombre_usuario': 'mlopez'}, 
                        self.app.config['SECRET_KEY'], algorithm='HS256')
        headers = {'Authorization': f'Bearer {token}'}

        # Crear un archivo simulado
        data = {
            'archivo': (BytesIO(b'Contenido del archivo'), 'archivo_test.txt'),
            # 'id_carpeta' omitido para simular que se sube a la raíz
        }

        # Realizar la petición POST
        response = self.client.post('/archivo/subir', data=data, headers=headers, content_type='multipart/form-data')

        # Verificar que la respuesta sea la esperada
        self.assertEqual(response.status_code, 201)  # Verificar que se haya subido exitosamente
        self.assertEqual(response.get_json(), {'message': 'Archivo subido exitosamente.'})

        # Verificar que el archivo se guardó en la raíz
        # Aquí podrías verificar si el archivo existe en la ruta correcta
        ruta_archivo = os.path.join(self.app.config['UPLOAD_FOLDER'], 'archivo_test.txt')
        self.assertTrue(os.path.exists(ruta_archivo))

        # Limpiar después de la prueba
        os.remove(ruta_archivo)

if __name__ == '__main__':
    unittest.main()
    #python -m unittest test.test_subir_archivo