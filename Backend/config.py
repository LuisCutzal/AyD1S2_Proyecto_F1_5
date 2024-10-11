import os
from dotenv import load_dotenv

# Cargar variables de entorno desde el archivo .env
load_dotenv()

class Config:
    # Clave secreta para firmar tokens JWT
    SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret_key')  # Cambia 'default_secret_key' por una clave predeterminada si es necesario
        
    # Tiempo de expiración del token JWT en segundos (ejemplo: 1 hora)
    JWT_EXPIRATION_DELTA = int(os.getenv('JWT_EXPIRATION_DELTA', 3600))  # 3600 segundos = 1 hora

# Cargar configuración en Flask
def load_config(app):
    app.config.from_object(Config)
