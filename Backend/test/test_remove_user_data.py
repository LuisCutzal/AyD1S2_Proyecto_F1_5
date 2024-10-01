import unittest
from unittest import mock
from flask import Flask
import jwt
from app.admin import admin_bp
from app.decorators import admin_required, token_required

class TestAdminRemoveUser(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.config['TESTING'] = True
        self.app.config['SECRET_KEY'] = 'test_secret_key'
        self.app.register_blueprint(admin_bp)
        self.client = self.app.test_client()

    @mock.patch('app.decorators.token_required')
    @mock.patch('app.decorators.admin_required')
    @mock.patch('app.admin.get_db_connection')
    def test_remove_user_success(self, mock_get_db_connection, mock_admin_required, mock_token_required):
        mock_token_required.return_value = lambda f: f
        mock_admin_required.return_value = lambda f: f
        
        # Crear un token para el usuario
        token = jwt.encode({'id_usuario': 16, 'id_rol': 1, 'nombre_usuario': 'nooooo'}, 
                           self.app.config['SECRET_KEY'], algorithm='HS256')
        headers = {'Authorization': f'Bearer {token}'}

        # Simular la conexión y el cursor de la base de datos
        mock_conn = mock.Mock()
        mock_cursor = mock.Mock()
        mock_get_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Simular que el usuario existe
        mock_cursor.fetchone.return_value = (16, 'LuAnto', 'cutzalluis@gmail.com')

        # Simular eliminación exitosa de las tablas relacionadas
        mock_cursor.execute.return_value = None
        mock_conn.commit.return_value = None

        # Llamar al endpoint DELETE
        response = self.client.delete('/users/16/remove', headers=headers)

        # Verificar la respuesta
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"message": "Toda la información del usuario ha sido eliminada correctamente."})
        self.assertEqual(mock_cursor.execute.call_count, 9)
        # Verificar las consultas ejecutadas
        mock_cursor.execute.assert_any_call('SELECT * FROM Usuarios WHERE id_usuario = ?', (16,))
        mock_cursor.execute.assert_any_call('DELETE FROM Archivos WHERE id_usuario_propietario = ?', (16,))
        mock_cursor.execute.assert_any_call('DELETE FROM Carpetas WHERE id_usuario_propietario = ?', (16,))
        mock_cursor.execute.assert_any_call('DELETE FROM Etiquetas WHERE id_usuario = ?', (16,))
        mock_cursor.execute.assert_any_call('DELETE FROM Favoritos WHERE id_usuario = ?', (16,))
        mock_cursor.execute.assert_any_call('DELETE FROM Actividades_Recientes WHERE id_usuario = ?', (16,))
        mock_cursor.execute.assert_any_call('DELETE FROM Backups_Cifrados WHERE id_usuario = ?', (16,))
        mock_cursor.execute.assert_any_call('DELETE FROM Compartidos WHERE id_usuario_propietario = ? OR id_usuario_destinatario = ?', (16, 16))
        mock_cursor.execute.assert_any_call('UPDATE Usuarios SET espacio_ocupado = 0 WHERE id_usuario = ?', (16,))
        mock_conn.commit.assert_called_once()
        mock_conn.close.assert_called_once()

    @mock.patch('app.decorators.token_required')
    @mock.patch('app.decorators.admin_required')
    @mock.patch('app.admin.get_db_connection')
    def test_remove_user_not_found(self, mock_get_db_connection, mock_admin_required, mock_token_required):
        mock_token_required.return_value = lambda f: f
        mock_admin_required.return_value = lambda f: f

        # Crear un token para el usuario
        token = jwt.encode({'id_usuario': 16, 'id_rol': 1, 'nombre_usuario': 'admin_user'}, 
                           self.app.config['SECRET_KEY'], algorithm='HS256')
        headers = {'Authorization': f'Bearer {token}'}

        # Simular la conexión y el cursor de la base de datos
        mock_conn = mock.Mock()
        mock_cursor = mock.Mock()
        mock_get_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Simular que el usuario no existe
        mock_cursor.fetchone.return_value = None

        # Llamar al endpoint DELETE
        response = self.client.delete('/users/999/remove', headers=headers)

        # Verificar la respuesta
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_json(), {"error": "Usuario no encontrado"})

        # Asegurarse de que se llama a close() incluso si el usuario no fue encontrado
        mock_conn.close.assert_called_once()

    @mock.patch('app.decorators.token_required')
    @mock.patch('app.decorators.admin_required')
    @mock.patch('app.admin.get_db_connection')
    def test_remove_user_db_error(self, mock_get_db_connection, mock_admin_required, mock_token_required):
        mock_token_required.return_value = lambda f: f
        mock_admin_required.return_value = lambda f: f

        # Crear un token para el usuario
        token = jwt.encode({'id_usuario': 16, 'id_rol': 1, 'nombre_usuario': 'admin'}, 
                        self.app.config['SECRET_KEY'], algorithm='HS256')
        headers = {'Authorization': f'Bearer {token}'}

        # Simular la conexión y el cursor de la base de datos
        mock_conn = mock.Mock()
        mock_cursor = mock.Mock()
        mock_get_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Simular que el usuario existe
        mock_cursor.fetchone.return_value = (16, 'nombre_usuario', 'user@example.com')

        # Simular que ocurre un error durante las operaciones de eliminación
        mock_cursor.execute.side_effect = Exception("Error en la base de datos")

        # Llamar al endpoint DELETE
        response = self.client.delete('/users/16/remove', headers=headers)

        # Verificar que se devuelve un código 500
        self.assertEqual(response.status_code, 500)

        # Verificar que el rollback fue llamado
        mock_conn.rollback.assert_called_once()
        mock_conn.close.assert_called_once()

if __name__ == '__main__':
    unittest.main()
