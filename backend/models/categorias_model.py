from config.database import create_connection

def obtener_categorias(user_id):
    conexion = create_connection()
    
    if not conexion:
        return None
    
    try:
        with conexion.cursor() as cursor:
            sql = "SELECT categoria, monto_maximo from categorias WHERE id_usuario = %s"
            cursor.execute(sql, (user_id,)) 
            
            return cursor.fetchall()
    
    except Exception as e:
        print(f"Error intentado obtener categorias: {e}")
        raise Exception("Error de base de datos")
    
    finally:
        conexion.close()

def crear_categoria(user_id, nombre, monto_maximo):
    conexion = create_connection()
    
    if not conexion:
        return None
    
    try:
        with conexion.cursor() as cursor:
            sql = "INSERT INTO categorias (categoria, monto_maximo, id_usuario) VALUES (%s, %s, %s)"
            cursor.execute(sql, (nombre, monto_maximo, user_id,)) 
            conexion.commit()
            return cursor.rowcount > 0
    
    except Exception as e:
        conexion.rollback()
        print(f"Error intentado agregar una categoria: {e}")
        raise Exception("Error de base de datos") 
    
    finally:
        conexion.close() 

def editar_categoria(categoria_id, user_id, nombre, monto_maximo):
    conexion = create_connection()
    
    if not conexion:
        return None
    
    try:
        with conexion.cursor() as cursor:
            sql = "UPDATE categorias SET categoria = %s, monto_maximo = %s WHERE id= %s AND id_usuario = %s"
            cursor.execute(sql, (nombre, monto_maximo, categoria_id, user_id,)) 
            conexion.commit()
            return cursor.rowcount > 0
    
    except Exception as e:
        conexion.rollback()
        print(f"Error intentado editar una categoria: {e}")
        raise Exception("Error de base de datos")  
    
    finally:
        conexion.close()


def eliminar_categoria(categoria_id, user_id):
    conexion = create_connection()
    
    if not conexion:
        return None
    
    try:
        with conexion.cursor() as cursor:
            sql = "DELETE FROM categorias WHERE id = %s AND id_usuario = %s"
            cursor.execute(sql, (categoria_id, user_id,)) 
            conexion.commit()
            return cursor.rowcount > 0
    
    except Exception as e:
        conexion.rollback()
        print(f"Error intentado eliminar una categoria: {e}")
        raise Exception("Error de base de datos")  
    
    finally:
        conexion.close()

