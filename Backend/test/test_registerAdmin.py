import unittest
from unittest import mock
from flask import Flask, jsonify, request
import json
import jwt
from app.admin import admin_bp
from app.decorators import admin_required, token_required

class TestAdminRegister(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.config['TESTING'] = True
        self.app.config['SECRET_KEY'] = 'test_secret_key'
        self.app.register_blueprint(admin_bp)
        self.client = self.app.test_client()

    @mock.patch('app.decorators.token_required')
    @mock.patch('app.decorators.admin_required')
    def test_register_usuario_admin(self, mock_admin_required, mock_token_required):
        # Simular que ambos decoradores no impiden el acceso
        mock_token_required.return_value = lambda f: f
        mock_admin_required.return_value = lambda f: f
        
        # Crear un token simulado
        token = jwt.encode({'id_usuario': 16, 'id_rol': 1, 'nombre_usuario': 'nooooo'}, 
                           self.app.config['SECRET_KEY'], algorithm='HS256')
        payload = {
            "nombre": "assdfasd",
            "apellido": "Chasdfasdalí",
            "nombre_usuario": "LuAntoaaa",
            "email": "sdfasdf@gmail.com",
            "celular": "98765432",
            "nacionalidad": "Guatemala",
            "pais_residencia": "Guatemala",
            "contrasena": "prueba1",
            "id_rol": 3,
            "espacio_asignado": 50
        }
        headers = {'Authorization': f'Bearer {token}'}
        with mock.patch('app.admin.get_db_connection') as mock_get_db_connection:
            mock_conn = mock.Mock()
            mock_cursor = mock.Mock()
            mock_get_db_connection.return_value = mock_conn
            mock_conn.cursor.return_value = mock_cursor
            mock_cursor.fetchone.return_value = None  # No existe el usuario
            mock_cursor.execute.return_value = None  # Éxito en la ejecución

            response = self.client.post('/registers', 
                             data=json.dumps(payload), 
                             content_type='application/json', 
                             headers=headers)

            self.assertEqual(response.status_code, 201)
            self.assertEqual(response.get_json(), {"message": "Usuario registrado correctamente"})

    #simular campos faltantes
    @mock.patch('app.decorators.token_required')
    @mock.patch('app.decorators.admin_required')
    def test_register_usuario_faltan_campos(self, mock_admin_required, mock_token_required):
        # Simular que ambos decoradores no impiden el acceso
        mock_token_required.return_value = lambda f: f
        mock_admin_required.return_value = lambda f: f
        # Crear un token simulado
        token = jwt.encode({'id_usuario': 16, 'id_rol': 1, 'nombre_usuario': 'nooooo'}, 
                           self.app.config['SECRET_KEY'], algorithm='HS256')
        # Datos incompletos
        payload = {
            "nombre": "Carlos",
            "apellido": "Lopez",
            "nombre_usuario": "carlos123",
            # Falta 'email'
            "celular": "123456789",
            "nacionalidad": "Mexicana",
            "pais_residencia": "México",
            "contrasena": "segura123",
            "id_rol": 2,
            "espacio_asignado": 100
        }
        headers = {'Authorization': f'Bearer {token}'}
        with mock.patch('app.admin.get_db_connection') as mock_get_db_connection:
            mock_conn = mock.Mock()
            mock_cursor = mock.Mock()
            mock_get_db_connection.return_value = mock_conn
            mock_conn.cursor.return_value = mock_cursor
            mock_cursor.fetchone.return_value = None  # No existe el usuario
            mock_cursor.execute.return_value = None  # Éxito en la ejecución

            response = self.client.post('/registers', 
                                         data=json.dumps(payload), 
                                         content_type='application/json', 
                                         headers=headers)

            self.assertEqual(response.status_code, 400)
            self.assertEqual(response.get_json(), {"error": "Field email is required"})

if __name__ == '__main__':
    unittest.main()
