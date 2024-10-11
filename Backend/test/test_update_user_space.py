import unittest
from unittest import mock
from flask import Flask
import jwt
from app.admin import admin_bp
from app.decorators import admin_required, token_required

class TestAdminUpdateUserSpace(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.config['TESTING'] = True
        self.app.config['SECRET_KEY'] = 'test_secret_key'
        self.app.register_blueprint(admin_bp)
        self.client = self.app.test_client()

    @mock.patch('app.decorators.token_required')
    @mock.patch('app.decorators.admin_required')
    @mock.patch('app.admin.get_db_connection')
    def test_update_user_space(self, mock_get_db_connection, mock_admin_required, mock_token_required):
        mock_token_required.return_value = lambda f: f
        mock_admin_required.return_value = lambda f: f
        
        # Crear un token simulado para un administrador
        token = jwt.encode({'id_usuario': 16, 'id_rol': 1, 'nombre_usuario': 'admin'}, 
                           self.app.config['SECRET_KEY'], algorithm='HS256')
        headers = {'Authorization': f'Bearer {token}'}

        # Mock de la conexión y cursor de base de datos
        mock_conn = mock.Mock()
        mock_cursor = mock.Mock()
        mock_get_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        
        # Simulando que el usuario con id_usuario=1 tiene un espacio ocupado de 50
        mock_cursor.fetchone.side_effect = [(50,), None]  # Primero devuelve 50, luego None para probar el caso de usuario no encontrado
        
        # Llama al endpoint
        response = self.client.put('/users/1/update_space', 
                                    headers=headers, 
                                    json={'espacio_asignado': 100})

        # Verifica el resultado
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {
            "message": "Espacio asignado actualizado correctamente"
        })

        # Verifica que la consulta SELECT fue llamada
        mock_cursor.execute.assert_any_call('SELECT espacio_ocupado FROM Usuarios WHERE id_usuario = ?', (1,))
        
        # Verifica que la consulta UPDATE fue llamada
        mock_cursor.execute.assert_any_call('UPDATE Usuarios SET espacio_asignado = ? WHERE id_usuario = ?', (100, 1))
        mock_conn.close.assert_called_once()

    @mock.patch('app.decorators.token_required')
    @mock.patch('app.decorators.admin_required')
    @mock.patch('app.admin.get_db_connection')
    def test_update_user_space_user_not_found(self, mock_get_db_connection, mock_admin_required, mock_token_required):
        mock_token_required.return_value = lambda f: f
        mock_admin_required.return_value = lambda f: f
        
        token = jwt.encode({'id_usuario': 16, 'id_rol': 1, 'nombre_usuario': 'admin'}, 
                           self.app.config['SECRET_KEY'], algorithm='HS256')
        headers = {'Authorization': f'Bearer {token}'}

        mock_conn = mock.Mock()
        mock_cursor = mock.Mock()
        mock_get_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Simulando que el usuario no existe
        mock_cursor.fetchone.return_value = None 
        
        # Llama al endpoint
        response = self.client.put('/users/1/update_space', 
                                    headers=headers, 
                                    json={'espacio_asignado': 100})

        # Verifica que se retorne el error de usuario no encontrado
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_json(), {"error": "Usuario no encontrado"})

        # Verifica que la consulta SELECT fue llamada
        mock_cursor.execute.assert_any_call('SELECT espacio_ocupado FROM Usuarios WHERE id_usuario = ?', (1,))
        
        # Verifica que la conexión se cerró
        mock_conn.close.assert_called_once()

if __name__ == '__main__':
    unittest.main()
    #python -m unittest test.test_update_user_space
