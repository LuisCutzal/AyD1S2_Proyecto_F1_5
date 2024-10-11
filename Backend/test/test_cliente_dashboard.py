import unittest
from unittest import mock
from flask import Flask
import jwt
from app.cliente import cliente_bp

class TestClienteDashboard(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.config['TESTING'] = True
        self.app.config['SECRET_KEY'] = 'test_secret_key'  # Asegúrate de que sea el mismo que en tu aplicación
        self.app.register_blueprint(cliente_bp)
        self.client = self.app.test_client()

    @mock.patch('app.decorators.token_required')
    @mock.patch('app.decorators.cliente_required')
    @mock.patch('app.cliente.get_db_connection')
    def test_cliente_dashboard_success(self, mock_get_db_connection, mock_cliente_required, mock_token_required):
        mock_token_required.return_value = lambda f: f
        mock_cliente_required.return_value = lambda f: f
        
        token = jwt.encode({'id_usuario': 12, 'id_rol': 3, 'nombre_usuario': 'mlopez'}, 
                        self.app.config['SECRET_KEY'], algorithm='HS256')
        headers = {'Authorization': f'Bearer {token}'}

        mock_conn = mock.Mock()
        mock_cursor = mock.Mock()
        mock_get_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        mock_cursor.fetchall.side_effect = [
            [(1, 'Carpeta 1', None), (2, 'Carpeta 2', 1)],  # Carpetas
            [(1, 'Archivo 1', 1, 2.5), (2, 'Archivo 2', 2, 1.0)],  # Archivos
        ]

        mock_cursor.fetchone.return_value = (100, 50)

        response = self.client.get('/dashboard', headers=headers)

        print("Respuesta:", response.get_json())  # Para ver la respuesta en la consola

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {
            'carpetas': [{'id_carpeta': 1, 'nombre': 'Carpeta 1', 'padre': None},
                        {'id_carpeta': 2, 'nombre': 'Carpeta 2', 'padre': 1}],
            'archivos': [{'id_archivo': 1, 'nombre': 'Archivo 1', 'carpeta': 1, 'tamano_mb': 2.5},
                        {'id_archivo': 2, 'nombre': 'Archivo 2', 'carpeta': 2, 'tamano_mb': 1.0}],
            'espacio_total': 100,
            'espacio_usado': 50,
            'espacio_libre': 50
        })

        mock_conn.close.assert_called_once()
    
    #para probar la coneccion de la base
    @mock.patch('app.decorators.token_required')
    @mock.patch('app.decorators.cliente_required')
    @mock.patch('app.cliente.get_db_connection')
    def test_cliente_dashboard_db_error(self, mock_get_db_connection, mock_cliente_required, mock_token_required):
        mock_token_required.return_value = lambda f: f
        mock_cliente_required.return_value = lambda f: f

        # Crear un token para el usuario cliente
        token = jwt.encode({'id_usuario': 1, 'id_rol': 3, 'nombre_usuario': 'cliente_user'}, 
                        self.app.config['SECRET_KEY'], algorithm='HS256')
        headers = {'Authorization': f'Bearer {token}'}

        # Simular la conexión y el cursor de la base de datos
        mock_conn = mock.Mock()
        mock_cursor = mock.Mock()
        mock_get_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Simular que ocurre un error durante la consulta
        mock_cursor.execute.side_effect = Exception("Error en la base de datos")

        # Llamar al endpoint GET
        response = self.client.get('/dashboard', headers=headers)

        # Verificar que se devuelve un código 500
        self.assertEqual(response.status_code, 500)

        # Verificar que se llama a close() incluso si ocurrió un error
        mock_conn.close.assert_called_once()

        # (Opcional) Verificar que se imprime un mensaje de error
        print("Error en la base de datos capturado correctamente.")

if __name__ == '__main__':
    unittest.main()
    #python -m unittest test.test_cliente_dashboard
