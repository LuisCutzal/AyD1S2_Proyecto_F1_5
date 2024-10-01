import unittest
from unittest import mock
from flask import Flask, jsonify, request
import jwt
from app.cliente import cliente_bp
import os

class TestModificarArchivo(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.config['TESTING'] = True
        self.app.config['SECRET_KEY'] = 'test_secret_key'
        self.app.register_blueprint(cliente_bp)
        self.client = self.app.test_client()

    @mock.patch('app.decorators.token_required')
    @mock.patch('app.decorators.cliente_required')
    @mock.patch('app.cliente.get_db_connection')
    @mock.patch('os.rename')  # Mocking os.rename to avoid actual file operations
    def test_modificar_archivo_existe(self, mock_rename, mock_get_db_connection, mock_cliente_required, mock_token_required):
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

        # Simular que el archivo existe y no está en papelera
        mock_cursor.fetchone.return_value = ('archivo_viejo.txt', 0)

        # Simular datos de la petición
        data = {'nombre_archivo': 'archivo_nuevo'}

        # Realizar la petición PUT
        print("Realizando la petición PUT para modificar el archivo...")
        response = self.client.put('/archivo/modificar/1', headers=headers, json=data)
        
        # Verificar que la respuesta sea la esperada
        print(f"Respuesta recibida: {response.get_json()}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {'message': 'Nombre del archivo modificado correctamente.'})

        # Verificar que las consultas se hayan ejecutado correctamente
        print("Llamadas a mock_cursor.execute:")
        for call in mock_cursor.execute.call_args_list:
            print(call)

        # Definir las llamadas esperadas
        expected_calls = [
            ('SELECT nombre_archivo, en_papelera FROM Archivos WHERE id_archivo = ? AND id_usuario_propietario = ?', (1, 12)),
            ('UPDATE Archivos SET nombre_archivo = ? WHERE id_archivo = ? AND id_usuario_propietario = ?', ('archivo_nuevo.txt', 1, 12))
        ]

        # Función para normalizar consultas
        def normalize_query(query):
            return ' '.join(query.strip().split())

        # Normalizar las llamadas
        actual_calls_normalized = [normalize_query(call[0][0]) for call in mock_cursor.execute.call_args_list]
        expected_calls_normalized = [normalize_query(call[0]) for call in expected_calls]

        print("Comparando llamadas reales con las esperadas...")
        print(f"Llamadas reales: {actual_calls_normalized}")
        print(f"Llamadas esperadas: {expected_calls_normalized}")

        self.assertEqual(actual_calls_normalized, expected_calls_normalized)

        # Asegurarse de que se llamó a os.rename
        mock_rename.assert_called_once()
        print("os.rename fue llamado correctamente.")

    @mock.patch('app.decorators.token_required')
    @mock.patch('app.decorators.cliente_required')
    @mock.patch('app.cliente.get_db_connection')
    def test_modificar_archivo_no_existe(self, mock_get_db_connection, mock_cliente_required, mock_token_required):
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

        # Simular datos de la petición
        data = {'nombre_archivo': 'archivo_nuevo'}

        # Realizar la petición PUT
        print("Realizando la petición PUT para modificar un archivo que no existe...")
        response = self.client.put('/archivo/modificar/999', headers=headers, json=data)

        # Verificar que la respuesta sea la esperada
        print(f"Respuesta recibida: {response.get_json()}")
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_json(), {'error': 'Archivo no encontrado.'})

        # Asegúrate de que no se haya llamado a commit
        mock_conn.commit.assert_not_called()
        print("No se llamó a commit, ya que el archivo no existe.")

    @mock.patch('app.decorators.token_required')
    @mock.patch('app.decorators.cliente_required')
    @mock.patch('app.cliente.get_db_connection')
    def test_modificar_archivo_en_papelera(self, mock_get_db_connection, mock_cliente_required, mock_token_required):
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

        # Simular que el archivo está en papelera
        mock_cursor.fetchone.return_value = ('archivo_en_papelera.txt', 1)

        # Simular datos de la petición
        data = {'nombre_archivo': 'archivo_nuevo'}

        # Realizar la petición PUT
        print("Realizando la petición PUT para modificar un archivo que está en papelera...")
        response = self.client.put('/archivo/modificar/1', headers=headers, json=data)

        # Verificar que la respuesta sea la esperada
        print(f"Respuesta recibida: {response.get_json()}")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {'error': 'El archivo está en papelera y no puede ser modificado.'})

        # Asegúrate de que no se haya llamado a commit
        mock_conn.commit.assert_not_called()
        print("No se llamó a commit, ya que el archivo está en papelera.")

if __name__ == '__main__':
    unittest.main()
