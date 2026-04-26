import os
from dotenv import load_dotenv
import pymysql

load_dotenv()

def create_connection():
    conexion = None
    try:
        conexion = pymysql.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME"),
            cursorclass='pymysql.cursors.DictCursor'
        )
    except pymysql.Error as e:
        print(f"Error al intentar conectar a MySQL: {e}")
    return conexion

conexion = create_connection()

if conexion:
    print("Conexión exitosa a MySQL")
   



