import unittest
from unittest import mock
from flask import Flask
import jwt
from app.cliente import cliente_bp

class TestEliminarArchivo(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.config['TESTING'] = True
        self.app.config['SECRET_KEY'] = 'test_secret_key'
        self.app.register_blueprint(cliente_bp)
        self.client = self.app.test_client()

    @mock.patch('app.decorators.token_required')
    @mock.patch('app.decorators.cliente_required')
    @mock.patch('app.cliente.get_db_connection')
    def test_eliminar_archivo_existe(self, mock_get_db_connection, mock_cliente_required, mock_token_required):
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

        # Simular que el archivo existe y se elimina
        mock_cursor.rowcount = 1  # Simulando que un archivo fue afectado
        mock_cursor.execute.return_value = None

        # Realizar la petición DELETE para eliminar el archivo
        response = self.client.delete('/archivo/eliminar/1', headers=headers)

        # Verificar que la respuesta sea la esperada
        print(f"Response Status Code: {response.status_code}")
        print(f"Response JSON: {response.json}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'message': 'Archivo movido a la papelera.'})

        # Asegurarse de que se haya llamado al método execute de la base de datos
        mock_cursor.execute.assert_called_once()
        print("Execute method was called with: ", mock_cursor.execute.call_args)

    @mock.patch('app.decorators.token_required')
    @mock.patch('app.decorators.cliente_required')
    @mock.patch('app.cliente.get_db_connection')
    def test_eliminar_archivo_no_existe(self, mock_get_db_connection, mock_cliente_required, mock_token_required):
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

        # Simular que no se afecta ninguna fila (archivo no existe)
        mock_cursor.rowcount = 0  # Asegúrate de que esto está configurado para simular la no existencia
        mock_cursor.execute.return_value = None

        # Realizar la petición DELETE para intentar eliminar el archivo
        response = self.client.delete('/archivo/eliminar/1', headers=headers)

        # Verificar que la respuesta sea la esperada
        print(f"Response Status Code: {response.status_code}")
        print(f"Response JSON: {response.json}")
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json, {'error': 'Archivo no encontrado.'})

if __name__ == '__main__':
    unittest.main()
    #python -m unittest test.test_eliminar_archivo
