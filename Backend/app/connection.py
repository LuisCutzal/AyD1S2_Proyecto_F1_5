import pyodbc
from dotenv import load_dotenv  # Importamos python-dotenv para cargar el .env
import os
# Configuración de la conexión a la base de datos
load_dotenv()
def get_db_connection():
    try:
        # Conexión al servidor SQL con autenticación de Windows
        conexion = pyodbc.connect(f'DRIVER={{SQL Server}};SERVER={os.getenv('SERVER')};DATABASE={os.getenv('DATABASE')};Trusted_Connection=yes;', autocommit=True)
        return conexion
    except pyodbc.Error as e:
        print(f"Error al conectar a SQL Server: {e}")
        return None
