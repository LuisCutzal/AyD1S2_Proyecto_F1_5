import unittest
from unittest import mock
from flask import Flask
import json
from app.auth import auth_bp  # Asegúrate de que auth_bp esté correctamente importado

class TestRegister(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.config['TESTING'] = True
        self.app.config['SECRET_KEY'] = 'test_secret_key'
        self.app.register_blueprint(auth_bp)
        self.client = self.app.test_client()

    def test_register_exitoso(self):
        # Datos válidos para el registro
        payload = {
            "nombre": "prueba1",
            "apellido": "testing",
            "nombre_usuario": "test",
            "email": "test@gmail.com",
            "celular": "98765432",
            "nacionalidad": "Guatemala",
            "pais_residencia": "Guatemala",
            "contrasena": "prueba1",
            "espacio_asignado": 15
        }
        
        response = self.client.post('/register',
                                    data=json.dumps(payload),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.get_json(), {"message": "Usuario registrado correctamente"})

    def test_faltan_campos(self):
        # Omite algunos campos requeridos
        payload = {
            "nombre": "prueba2",
            "apellido": "testing2",
            # Falta 'nombre_usuario', 'email', etc.
        }
        
        response = self.client.post('/register',
                                    data=json.dumps(payload),
                                    content_type='application/json')

        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.get_json())

    def test_email_invalido(self):
        # Email con formato incorrecto
        payload = {
            "nombre": "prueba2",
            "apellido": "testing2",
            "nombre_usuario": "prueba2",
            "email": "juanperez-email-invalido",
            "celular": "1234567890",
            "nacionalidad": "Guatemalteco",
            "pais_residencia": "Guatemala",
            "contrasena": "password123",
            "espacio_asignado": 100
        }
        
        response = self.client.post('/register',
                                    data=json.dumps(payload),
                                    content_type='application/json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"Error": "El correo no tiene el formato adecuado"})

    def test_usuario_o_email_existente(self):
        # Datos que ya existen en la base de datos
        payload = {
            "nombre": "Juan",
            "apellido": "Pérez",
            "nombre_usuario": "usuario_duplicado",
            "email": "email_duplicado@example.com",
            "celular": "1234567890",
            "nacionalidad": "Guatemalteco",
            "pais_residencia": "Guatemala",
            "contrasena": "password123",
            "espacio_asignado": 100
        }
        
        # Mockear la respuesta para simular que el usuario ya existe en la base de datos
        response = self.client.post('/register',
                                    data=json.dumps(payload),
                                    content_type='application/json')

        self.assertEqual(response.status_code, 409)
        self.assertEqual(response.get_json(), {"Error": "El nombre de usuario o correo electrónico ya existen"})
    
    def test_conexion_fallida(self):
        # Simular que no se puede conectar a la base de datos
        payload = {
            "nombre": "Juan",
            "apellido": "Pérez",
            "nombre_usuario": "juanperez",
            "email": "juanperez@example.com",
            "celular": "1234567890",
            "nacionalidad": "Guatemalteco",
            "pais_residencia": "Guatemala",
            "contrasena": "password123",
            "espacio_asignado": 100
        }

        # Mockear que la conexión a la base de datos falla
        with unittest.mock.patch('app.auth.get_db_connection', return_value=None):
            response = self.client.post('/register',
                                        data=json.dumps(payload),
                                        content_type='application/json')

            self.assertEqual(response.status_code, 500)
            self.assertEqual(response.get_json(), {"error": "No se pudo establecer la conexión a la base de datos"})

    

if __name__ == '__main__':
    unittest.main()
    #python -m unittest test.test_register
