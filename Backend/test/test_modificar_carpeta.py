import unittest
from unittest import mock
from flask import Flask
import jwt
from app.cliente import cliente_bp

class TestModificarCarpeta(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.config['TESTING'] = True
        self.app.config['SECRET_KEY'] = 'test_secret_key'
        self.app.register_blueprint(cliente_bp)
        self.client = self.app.test_client()

    @mock.patch('app.decorators.token_required')
    @mock.patch('app.decorators.cliente_required')
    @mock.patch('app.cliente.get_db_connection')
    def test_modificar_carpeta_existe(self, mock_get_db_connection, mock_cliente_required, mock_token_required):
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

        # Simular que la carpeta existe y no está en papelera
        mock_cursor.fetchone.return_value = mock.Mock(en_papelera=0)

        # Simular datos de la petición
        data = {'nombre_carpeta': 'Nueva Carpeta'}

        # Realizar la petición PUT
        response = self.client.put('/carpeta/1', headers=headers, json=data)

        # Verificar que la respuesta sea la esperada
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {'message': 'Carpeta modificada correctamente'})

        # Verificar que las consultas se hayan ejecutado correctamente
        print("Llamadas a mock_cursor.execute:")
        for call in mock_cursor.execute.call_args_list:
            print(call)

        # Definir las llamadas esperadas
        expected_calls = [
            ('SELECT en_papelera FROM Carpetas WHERE id_carpeta = ? AND id_usuario_propietario = ?', (1, 12)),
            ('UPDATE Carpetas SET nombre_carpeta = ? WHERE id_carpeta = ? AND id_usuario_propietario = ?', ('Nueva Carpeta', 1, 12))
        ]

        # Función para normalizar consultas
        def normalize_query(query):
            return ' '.join(query.strip().split())

        # Normalizar las llamadas
        actual_calls_normalized = [normalize_query(call[0][0]) for call in mock_cursor.execute.call_args_list]
        expected_calls_normalized = [normalize_query(call[0]) for call in expected_calls]

        self.assertEqual(actual_calls_normalized, expected_calls_normalized)

    @mock.patch('app.decorators.token_required')
    @mock.patch('app.decorators.cliente_required')
    @mock.patch('app.cliente.get_db_connection')
    def test_modificar_carpeta_no_existe(self, mock_get_db_connection, mock_cliente_required, mock_token_required):
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

        # Simular que la carpeta no existe
        mock_cursor.fetchone.return_value = None

        # Simular datos de la petición
        data = {'nombre_carpeta': 'Nueva Carpeta'}

        # Realizar la petición PUT
        response = self.client.put('/carpeta/999', headers=headers, json=data)

        # Verificar que la respuesta sea la esperada
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_json(), {'error': 'La carpeta no existe.'})

        # Asegúrate de que no se haya llamado a commit
        mock_conn.commit.assert_not_called()

    @mock.patch('app.decorators.token_required')
    @mock.patch('app.decorators.cliente_required')
    @mock.patch('app.cliente.get_db_connection')
    def test_modificar_carpeta_en_papelera(self, mock_get_db_connection, mock_cliente_required, mock_token_required):
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

        # Simular que la carpeta está en papelera
        mock_cursor.fetchone.return_value = mock.Mock(en_papelera=1)

        # Simular datos de la petición
        data = {'nombre_carpeta': 'Nueva Carpeta'}

        # Realizar la petición PUT
        response = self.client.put('/carpeta/1', headers=headers, json=data)

        # Verificar que la respuesta sea la esperada
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {'error': 'La carpeta está en papelera o no existe y no puede ser modificada.'})

        # Asegúrate de que no se haya llamado a commit
        mock_conn.commit.assert_not_called()

if __name__ == '__main__':
    unittest.main()
    #python -m unittest test.test_modificar_carpeta