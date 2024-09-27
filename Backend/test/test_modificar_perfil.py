import unittest
from unittest import mock
from flask import Flask
import jwt
from app.cliente import cliente_bp

class TestModificarPerfil(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.config['TESTING'] = True
        self.app.config['SECRET_KEY'] = 'test_secret_key'
        self.app.register_blueprint(cliente_bp)
        self.client = self.app.test_client()

    @mock.patch('app.decorators.token_required')
    @mock.patch('app.decorators.cliente_required')
    @mock.patch('app.cliente.get_db_connection')
    def test_modificar_perfil_exito(self, mock_get_db_connection, mock_cliente_required, mock_token_required):
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

        # Simular datos de la petición
        data = {
            'nombre': 'NuevoNombre',
            'apellido': 'NuevoApellido',
            'email': 'nuevoemail@example.com'
        }

        # Realizar la petición PUT
        response = self.client.put('/perfil/modificar', headers=headers, json=data)

        # Verificar que la respuesta sea la esperada
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {'message': 'Perfil modificado correctamente.'})

        # Verificar que las consultas se hayan ejecutado correctamente
        expected_calls = [
            ('UPDATE Usuarios SET nombre = ? WHERE id_usuario = ?', ('NuevoNombre', 12)),
            ('UPDATE Usuarios SET apellido = ? WHERE id_usuario = ?', ('NuevoApellido', 12)),
            ('UPDATE Usuarios SET email = ? WHERE id_usuario = ?', ('nuevoemail@example.com', 12))
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
    def test_modificar_perfil_usuario_no_existe(self, mock_get_db_connection, mock_cliente_required, mock_token_required):
        mock_token_required.return_value = lambda f: f
        mock_cliente_required.return_value = lambda f: f

        # Crear un token para el usuario cliente
        token = jwt.encode({'id_usuario': 999, 'id_rol': 3, 'nombre_usuario': 'mlopez'},
                        self.app.config['SECRET_KEY'], algorithm='HS256')
        headers = {'Authorization': f'Bearer {token}'}

        # Simular la conexión y el cursor de la base de datos
        mock_conn = mock.Mock()
        mock_cursor = mock.Mock()
        mock_get_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Simular datos de la petición
        data = {
            'nombre': 'NuevoNombre',
            'apellido': 'NuevoApellido'
        }

        # Simular que no se encuentra el usuario
        mock_cursor.execute.side_effect = Exception('El usuario no existe')  # Este es el error lanzado en la función

        # Realizar la petición PUT
        response = self.client.put('/perfil/modificar', headers=headers, json=data)

        # Verificar que la respuesta sea la esperada
        self.assertEqual(response.status_code, 500)  # Cambiar a 500 porque ahora lanza una excepción
        self.assertIn('Error al modificar el perfil:', response.get_json()['error'])  # Verificar que contenga el mensaje de error

        # Asegúrate de que no se haya llamado a commit
        mock_conn.commit.assert_not_called()

    

        
if __name__ == '__main__':
    unittest.main()
    #python -m unittest test.test_modificar_perfil
