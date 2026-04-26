from config.database import create_connection

def buscar_usuario_por_email(email):
    
    conexion = create_connection()
    
    if not conexion:
        return None
    
    try:
         with conexion.cursor() as cursor:
            sql = "SELECT * FROM usuarios WHERE email = %s" 
            cursor.execute(sql, (email,))
            usuario = cursor.fetchone()
            return usuario
    except Exception as e:
        print(f"Error al ejecutar la consulta: {e}")
        raise Exception("Error de base de datos")