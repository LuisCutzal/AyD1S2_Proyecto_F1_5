import unittest
from unittest import mock
from flask import Flask
import jwt
from app.cliente import cliente_bp
import os

class TestDescargarArchivo(unittest.TestCase):
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
    def test_descargar_archivo_existe(self, mock_get_db_connection, mock_cliente_required, mock_token_required):
        # Simular decoradores
        mock_token_required.return_value = lambda f: f
        mock_cliente_required.return_value = lambda f: f

        # Crear un token para el usuario cliente
        token = jwt.encode({'id_usuario': 12, 'id_rol': 3, 'nombre_usuario': 'mlopez'}, 
                           self.app.config['SECRET_KEY'], algorithm='HS256')
        headers = {'Authorization': f'Bearer {token}'}

        # Simular la conexión y el cursor de la base de datos
        mock_conn = mock.Mock()
        mock_cursor = mock.Mock()
        mock_get_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Simular que el archivo existe
        mock_cursor.fetchone.return_value = ('archivo_test.txt',)

        # Verificar que el archivo existe en la ruta de subida
        file_path = os.path.join(self.app.config['UPLOAD_FOLDER'], 'archivo_test.txt')
        with open(file_path, 'w') as f:
            f.write('Contenido de prueba')
            print(f"Archivo de prueba creado en: {file_path}")

        try:
            # Realizar la petición GET para descargar el archivo
            print("Realizando la petición GET para descargar el archivo...")
            response = self.client.get('/archivo/descargar/1', headers=headers)

            # Verificar que la respuesta sea la esperada
            self.assertEqual(response.status_code, 200)
            print(f"Respuesta: {response.status_code}, Contenido: {response.data.decode('utf-8')}")
            self.assertTrue('attachment; filename=archivo_test.txt' in response.headers['Content-Disposition'])

            # Comprobar el contenido del archivo descargado
            self.assertEqual(response.data.decode('utf-8'), 'Contenido de prueba')
            print("Contenido del archivo verificado correctamente.")
        finally:
            # Limpiar después de la prueba
            try:
                os.remove(file_path)
                print(f"Archivo de prueba eliminado: {file_path}")
            except OSError as e:
                print(f"Error al eliminar el archivo de prueba: {e}")

    @mock.patch('app.decorators.token_required')
    @mock.patch('app.decorators.cliente_required')
    @mock.patch('app.cliente.get_db_connection')
    def test_descargar_archivo_no_existe(self, mock_get_db_connection, mock_cliente_required, mock_token_required):
        # Simular decoradores
        mock_token_required.return_value = lambda f: f
        mock_cliente_required.return_value = lambda f: f

        # Crear un token para el usuario cliente
        token = jwt.encode({'id_usuario': 12, 'id_rol': 3, 'nombre_usuario': 'mlopez'}, 
                           self.app.config['SECRET_KEY'], algorithm='HS256')
        headers = {'Authorization': f'Bearer {token}'}

        # Simular la conexión y el cursor de la base de datos
        mock_conn = mock.Mock()
        mock_cursor = mock.Mock()
        mock_get_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Simular que el archivo no existe
        mock_cursor.fetchone.return_value = None
        print("Simulando que el archivo no existe en la base de datos.")

        # Realizar la petición GET para intentar descargar el archivo
        response = self.client.get('/archivo/descargar/1', headers=headers)
        print(f"Respuesta para archivo no existente: {response.status_code}, Mensaje: {response.json}")

        # Verificar que la respuesta sea la esperada
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json, {'error': 'Archivo no encontrado.'})

if __name__ == '__main__':
    unittest.main()
    #python -m unittest test.test_descargar_archivo
