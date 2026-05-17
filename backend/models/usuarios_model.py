from config.database import create_connection


def buscar_usuario_por_email(email):
    
    conexion = create_connection()
     
    if not conexion:
        return None
    
    try:
        with conexion.cursor() as cursor:
            sql = "SELECT id, nombre_usuario, email, verificado, password FROM usuarios WHERE email = %s" 
            cursor.execute(sql, (email,))
            usuario = cursor.fetchone()
            return usuario
    except Exception as e:
        print(f"Error al ejecutar la consulta: {e}")
        raise Exception("Error de base de datos")
    finally:
        conexion.close()


def crear_usuario(nombre_usuario, email, password, presupuesto, token_verificacion):
    conexion = create_connection()
    
    if not conexion:
        return None
    
    try:
    
        with conexion.cursor() as cursor:
            sql = """INSERT INTO usuarios 
                     (nombre_usuario, email, password, presupuesto_maximo_mensual, token_verificacion) 
                     VALUES (%s, %s, %s, %s, %s)"""
            cursor.execute(sql, (nombre_usuario, email, password, presupuesto, token_verificacion))
            conexion.commit()
            return cursor.lastrowid
    except Exception as e:
        conexion.rollback()
        print(f"Error al crear usuario: {e}")
        raise Exception("Error al crear usuario")
    finally:
        conexion.close()
        
def verificar_usuario(token):
    conexion = create_connection()
     
    if not conexion:
        return None
    try:
        with conexion.cursor() as cursor:
            sql = "UPDATE usuarios SET verificado = 1 WHERE token_verificacion = %s" 
            cursor.execute(sql, (token,))
            conexion.commit()
            return cursor.rowcount > 0
            
    except Exception as e:
        conexion.rollback()
        print(f"Error al ejecutar la consulta: {e}")
        raise Exception("Error de base de datos")
    finally:
        conexion.close()
        
        
def cambiar_contraseña(new_password, user_id):
    conexion = create_connection()
    
    if not conexion:
        return None
    
    try:
        
        with conexion.cursor() as cursor:
            sql = "UPDATE usuarios SET password = %s WHERE id = %s"
            cursor.execute(sql, (new_password, user_id,))
            conexion.commit()
            return cursor.rowcount > 0
    
    except Exception as e:
        conexion.rollback()
        print(f"Error al cambiar contraseña {e}")
        raise Exception("Error de base de datos")
    finally:
        conexion.close()
    