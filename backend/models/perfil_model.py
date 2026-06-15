from config.database import create_connection

def obtener_perfil(user_id):
    conexion = create_connection()
    
    try:
        with conexion.cursor() as cursor:
            sql = "SELECT id, nombre_usuario, email, password, presupuesto_maximo_mensual, foto_perfil FROM usuarios WHERE id = %s"
            cursor.execute(sql, (user_id,))
            return cursor.fetchone()
    except Exception as e:
        print(f"Error al obtener perfil: {e}")
        raise Exception("Error de base de datos")
    finally:
         if conexion:
            conexion.close()

def cambiar_nickname(user_id, nickname):
    conexion = create_connection()
 
    try:
        with conexion.cursor() as cursor:
            sql = "UPDATE usuarios SET nombre_usuario = %s WHERE id = %s"
            cursor.execute(sql, (nickname, user_id))
            conexion.commit()
            return cursor.rowcount > 0
    except Exception as e:
        conexion.rollback()
        print(f"Error al cambiar nickname: {e}")
        raise Exception("Error de base de datos")
    finally:
        if conexion:
            conexion.close()

def cambiar_password(user_id, password):
    conexion = create_connection()

    try:
        with conexion.cursor() as cursor:
            sql = "UPDATE usuarios SET password = %s WHERE id = %s"
            cursor.execute(sql, (password, user_id))
            conexion.commit()
            return cursor.rowcount > 0
    except Exception as e:
        conexion.rollback()
        print(f"Error al cambiar password: {e}")
        raise Exception("Error de base de datos")
    finally:
         if conexion:
            conexion.close()

def cambiar_presupuesto(user_id, presupuesto):
    conexion = create_connection()
    
    try:
        with conexion.cursor() as cursor:
            sql = "UPDATE usuarios SET presupuesto_maximo_mensual = %s WHERE id = %s"
            cursor.execute(sql, (presupuesto, user_id))
            conexion.commit()
            return cursor.rowcount > 0
    except Exception as e:
        conexion.rollback()
        print(f"Error al cambiar presupuesto: {e}")
        raise Exception("Error de base de datos")
    finally:
         if conexion:
            conexion.close()

def cambiar_foto(user_id, url_foto):
    conexion = create_connection()

    try:
        with conexion.cursor() as cursor:
            sql = "UPDATE usuarios SET foto_perfil = %s WHERE id = %s"
            cursor.execute(sql, (url_foto, user_id))
            conexion.commit()
            return cursor.rowcount > 0
    except Exception as e:
        conexion.rollback()
        print(f"Error al cambiar foto: {e}")
        raise Exception("Error de base de datos")
    finally:
         if conexion:
            conexion.close()

def eliminar_cuenta(user_id):
    conexion = create_connection()

    try:
        with conexion.cursor() as cursor:
            sql = "DELETE FROM usuarios WHERE id = %s"
            cursor.execute(sql, (user_id,))
            conexion.commit()
            return cursor.rowcount > 0
    except Exception as e:
        conexion.rollback()
        print(f"Error al eliminar cuenta: {e}")
        raise Exception("Error de base de datos")
    finally:
        if conexion:
            conexion.close()