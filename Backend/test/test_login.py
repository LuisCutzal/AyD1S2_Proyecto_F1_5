import unittest
from flask import Flask
import json
from app.auth import auth_bp  # Asegúrate de que auth_bp esté correctamente importado

class TestLogin(unittest.TestCase):  # Class name updated
    def setUp(self):
        self.app = Flask(__name__)
        self.app.config['TESTING'] = True
        self.app.config['SECRET_KEY'] = 'test_secret_key'
        self.app.register_blueprint(auth_bp)
        # Crear un cliente de pruebas
        self.client = self.app.test_client()

    def test_login_exitoso(self):
        # Payload de la solicitud
        payload = {
            "identificador": "feran",
            "contrasena": "prueba"
        }
        # Enviar la solicitud POST al endpoint /login
        response = self.client.post('/login',
                                    data=json.dumps(payload),
                                    content_type='application/json')

        # Verificar la respuesta
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('message', data)
        self.assertIn('token', data)
        self.assertEqual(data['message'], 'Login successful')

    def test_login_credenciales_invalidas(self):
        payload = {
            "identificador": "usuario_incorrecto",
            "contrasena": "contraseña_incorrecta"
        }

        response = self.client.post('/login',
                                    data=json.dumps(payload),
                                    content_type='application/json')

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.get_json(), {"error": "Nombre de usuario/correo o contraseña son inválidos."})
    
    def test_login_faltan_credenciales(self):
        payload = {
            "identificador": "usuario1"
            # Falta 'contrasena'
        }

        response = self.client.post('/login',
                                    data=json.dumps(payload),
                                    content_type='application/json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"error": "Nombre de usuario/correo y contraseña son requeridos"})
    
if __name__ == '__main__':
    unittest.main()