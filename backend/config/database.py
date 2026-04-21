import os
from dotenv import load_dotenv
from mysql.connector import connect, Error

load_dotenv()

def create_connection():
    conexion = None
    try:
        conexion = connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME")
        )
    except Error as e:
        print(f"Error al intentar conectar a MySQL: {e}")
    return conexion

def get_cursor(conexion):
    return conexion.cursor(dictionary=True)

conexion = create_connection()

if conexion and conexion.is_connected():
    print("Conexión exitosa a MySQL")
   