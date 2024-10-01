import unittest
from unittest import mock
from flask import Flask
import jwt
from app.admin import admin_bp
from datetime import datetime, timedelta
from app.decorators import admin_required, token_required

class TestAdminGetInactiveUsers(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.config['TESTING'] = True
        self.app.config['SECRET_KEY'] = 'test_secret_key'
        self.app.register_blueprint(admin_bp)
        self.client = self.app.test_client()

    @mock.patch('app.decorators.token_required')
    @mock.patch('app.decorators.admin_required')
    @mock.patch('app.admin.get_db_connection')
    def test_get_inactive_users(self, mock_get_db_connection, mock_admin_required, mock_token_required):
        mock_token_required.return_value = lambda f: f
        mock_admin_required.return_value = lambda f: f
        
        token = jwt.encode({'id_usuario': 16, 'id_rol': 1, 'nombre_usuario': 'nooooo'}, 
                           self.app.config['SECRET_KEY'], algorithm='HS256')
        headers = {'Authorization': f'Bearer {token}'}

        mock_conn = mock.Mock()
        mock_cursor = mock.Mock()
        mock_get_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Simulamos que hay dos usuarios inactivos
        mock_cursor.fetchall.return_value = [
            (1, 'usuario1', 'user1@example.com', None),  # Nunca inició sesión
            (2, 'usuario2', 'user2@example.com', datetime(2023, 7, 15, 10, 30, 0))  # Fecha anterior
        ]
        
        # Llama al endpoint
        response = self.client.get('/users/inactive', headers=headers)

        # Verifica que la respuesta sea correcta
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), [
            {
                "id_usuario": 1,
                "nombre_usuario": "usuario1",
                "email": "user1@example.com",
                "fecha_ultimo_login": "Nunca"
            },
            {
                "id_usuario": 2,
                "nombre_usuario": "usuario2",
                "email": "user2@example.com",
                "fecha_ultimo_login": "2023-07-15T10:30:00"
            }
        ])

        # Verifica que la consulta SELECT fue llamada correctamente
        mock_cursor.execute.assert_called_once_with('''
            SELECT id_usuario, nombre_usuario, email, fecha_ultimo_login 
            FROM Usuarios 
            WHERE fecha_ultimo_login IS NULL OR fecha_ultimo_login < ?
        ''', (mock.ANY,))
        
        mock_conn.close.assert_called_once()

if __name__ == '__main__':
    unittest.main()
    #python -m unittest test.test_users_inactive