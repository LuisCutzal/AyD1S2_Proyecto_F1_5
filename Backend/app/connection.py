import pyodbc
from dotenv import load_dotenv  # Importamos python-dotenv para cargar el .env
import os

#Cargar variables de entorno
load_dotenv()

def get_db_connection():
    try:
        # Conexión al servidor SQL con autenticación SQL
        connection_string = (
            f'DRIVER={{ODBC Driver 17 for SQL Server}};'
            f'SERVER={os.getenv("SERVER")};'
            f'DATABASE={os.getenv("DATABASE")};'
            f'UID={os.getenv("USERNAME")};'
            f'PWD={os.getenv("PASSWORD")};'
        )
        conexion = pyodbc.connect(connection_string, autocommit=True)
        return conexion
    except pyodbc.Error as e:
        print(f"Error al conectar a SQL Server: {e}")
        return None


# load_dotenv()
# server = 'DESKTOP-E6KH831' 
# database = 'AYD_DataCenter'

# def get_db_connection():
#     try:
#         # Conexión al servidor SQL con autenticación de Windows
#         conexion = pyodbc.connect(f'DRIVER={{SQL Server}};SERVER=DESKTOP-E6KH831;DATABASE=AYD_DataCenter;Trusted_Connection=yes;', autocommit=True)
#         return conexion
#     except pyodbc.Error as e:
#         print(f"Error al conectar a SQL Server: {e}")
#         return None