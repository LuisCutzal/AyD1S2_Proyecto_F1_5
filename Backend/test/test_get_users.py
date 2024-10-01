import unittest
from unittest import mock
from flask import Flask, jsonify
import json
import jwt
from app.admin import admin_bp
from app.decorators import admin_required, token_required

class TestAdminGetUsers(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.config['TESTING'] = True
        self.app.config['SECRET_KEY'] = 'test_secret_key'
        self.app.register_blueprint(admin_bp)
        self.client = self.app.test_client()

    @mock.patch('app.decorators.token_required')
    @mock.patch('app.decorators.admin_required')
    @mock.patch('app.admin.get_db_connection')  # Mock de la conexión a la base de datos
    def test_get_users(self, mock_get_db_connection, mock_admin_required, mock_token_required):
        # Simular que ambos decoradores no impiden el acceso
        mock_token_required.return_value = lambda f: f
        mock_admin_required.return_value = lambda f: f
        
        # Crear un token simulado
        token = jwt.encode({'id_usuario': 16, 'id_rol': 1, 'nombre_usuario': 'nooooo'}, 
                           self.app.config['SECRET_KEY'], algorithm='HS256')
        headers = {'Authorization': f'Bearer {token}'}

        # Simulación de la conexión a la base de datos y el cursor
        mock_conn = mock.Mock()
        mock_cursor = mock.Mock()
        mock_get_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        
        # Datos de prueba que simulan lo que se devolvería de la base de datos
        mock_cursor.fetchall.return_value = [
            (1, "user1", 100, 50),
            (2, "user2", 150, 75)
        ]
        
        # Realizar la solicitud de obtención de usuarios
        response = self.client.get('/users', headers=headers)

        # Verificaciones de la respuesta
        self.assertEqual(response.status_code, 200)
        expected_response = [
            {"id_usuario": 1, "nombre_usuario": "user1", "espacio_asignado": 100, "espacio_ocupado": 50},
            {"id_usuario": 2, "nombre_usuario": "user2", "espacio_asignado": 150, "espacio_ocupado": 75}
        ]
        self.assertEqual(response.get_json(), expected_response)
        
        # Verificar que se ejecutó la consulta para obtener usuarios
        mock_cursor.execute.assert_called_once_with('SELECT id_usuario, nombre_usuario, espacio_asignado, espacio_ocupado FROM Usuarios')
        # Verificar que se cierra la conexión
        mock_conn.close.assert_called_once()
    
    @mock.patch('app.decorators.token_required')
    @mock.patch('app.decorators.admin_required')
    @mock.patch('app.admin.get_db_connection')  # Mock de la conexión a la base de datos
    def test_get_users_no_users(self, mock_get_db_connection, mock_admin_required, mock_token_required):
        # Simular que ambos decoradores no impiden el acceso
        mock_token_required.return_value = lambda f: f
        mock_admin_required.return_value = lambda f: f

        # Crear un token simulado
        token = jwt.encode({'id_usuario': 16, 'id_rol': 1, 'nombre_usuario': 'nooooo'}, 
                        self.app.config['SECRET_KEY'], algorithm='HS256')
        headers = {'Authorization': f'Bearer {token}'}

        # Simulación de la conexión a la base de datos y el cursor
        mock_conn = mock.Mock()
        mock_cursor = mock.Mock()
        mock_get_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Simular que no hay usuarios en la base de datos
        mock_cursor.fetchall.return_value = []

        # Realizar la solicitud de obtención de usuarios
        response = self.client.get('/users', headers=headers)

        # Verificaciones de la respuesta
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), [])  # Esperamos una lista vacía

if __name__ == '__main__':
    unittest.main()
    #python -m unittest test.test_get_users
