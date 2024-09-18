import pyodbc

# Configuración de la conexión a la base de datos
server = 'DESKTOP-E6KH831' 
database = 'AYD_DataCenter'

def get_db_connection():
    try:
        # Conexión al servidor SQL con autenticación de Windows
        conexion = pyodbc.connect(f'DRIVER={{SQL Server}};SERVER={server};DATABASE={database};Trusted_Connection=yes;', autocommit=True)
        return conexion
    except pyodbc.Error as e:
        print(f"Error al conectar a SQL Server: {e}")
        return None
