import unittest
from unittest import mock
from flask import Flask
import jwt
from app.cliente import cliente_bp

class TestClienteCarpeta(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.config['TESTING'] = True
        self.app.config['SECRET_KEY'] = 'test_secret_key'  # Asegúrate de que sea el mismo que en tu aplicación
        self.app.register_blueprint(cliente_bp)
        self.client = self.app.test_client()
    @mock.patch('app.decorators.token_required')
    @mock.patch('app.decorators.cliente_required')
    @mock.patch('app.cliente.get_db_connection')
    def test_crear_carpeta_success(self, mock_get_db_connection, mock_cliente_required, mock_token_required):
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
        datos_carpeta = {
            'nombre_carpeta': 'Nueva Carpeta',
            'id_carpeta_padre': None
        }

        # Realizar la petición POST
        response = self.client.post('/carpeta', json=datos_carpeta, headers=headers)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.get_json(), {'message': 'Carpeta creada correctamente'})
        mock_cursor.execute.assert_called_once()
        called_query = mock_cursor.execute.call_args[0][0].strip()
        expected_query = ''' 
            INSERT INTO Carpetas (nombre_carpeta, id_usuario_propietario, id_carpeta_padre)
            VALUES (?, ?, ?)
        '''.strip()

        # Normalizar ambos strings eliminando espacios adicionales
        self.assertEqual(' '.join(called_query.split()), ' '.join(expected_query.split()))
        self.assertEqual(mock_cursor.execute.call_args[0][1], ('Nueva Carpeta', 12, None))  # Comprobar los parámetros
        mock_conn.commit.assert_called_once()

    @mock.patch('app.decorators.token_required')
    @mock.patch('app.decorators.cliente_required')
    @mock.patch('app.cliente.get_db_connection')
    def test_crear_carpeta_padre_no_existe(self, mock_get_db_connection, mock_cliente_required, mock_token_required):
        mock_token_required.return_value = lambda f: f
        mock_cliente_required.return_value = lambda f: f

        # Crear un token para el usuario cliente
        token = jwt.encode({'id_usuario': 12, 'id_rol': 3, 'nombre_usuario': 'mlopez'}, 
                        self.app.config['SECRET_KEY'], algorithm='HS256')
        headers = {'Authorization': f'Bearer {token}'}
        mock_conn = mock.Mock()
        mock_cursor = mock.Mock()
        mock_get_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        # Simular que la carpeta padre no existe
        mock_cursor.fetchone.return_value = None

        datos_carpeta = {
            'nombre_carpeta': 'Nueva Carpeta',
            'id_carpeta_padre': 999  # ID que no existe
        }
        response = self.client.post('/carpeta', json=datos_carpeta, headers=headers)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {'error': 'La carpeta padre no existe.'})

        mock_cursor.execute.assert_called_once_with(
            mock.ANY, (999, 12)
        )
        mock_conn.commit.assert_not_called()


if __name__ == '__main__':
    unittest.main()
