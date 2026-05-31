from config.database import create_connection

def obtener_id_categoria(user_id, nombre_categoria):
    conexion = create_connection()

    if not conexion:
        return None
    
    try:
        with conexion.cursor() as cursor:
            sql = "SELECT id FROM categorias WHERE id_usuario = %s AND nombre = %s"
            cursor.execute(sql, (user_id, nombre_categoria))
            resultado = cursor.fetchone()
            return resultado["id"] if resultado else None
    except Exception as e:
        print(f"Error al obtener id categoria: {e}")
        raise Exception("Error de base de datos")
    finally:
        conexion.close()

def crear_gasto(user_id, categoria_id, monto, descripcion):
    conexion = create_connection()
    
    if not conexion:
        return None
    
    try:
        with conexion.cursor() as cursor:
            sql = """INSERT INTO gastos (id_usuario, id_categoria, monto_gasto, descripcion) 
                     VALUES (%s, %s, %s, %s)"""
            cursor.execute(sql, (user_id, categoria_id, monto, descripcion))
            conexion.commit()
            return cursor.rowcount > 0
    except Exception as e:
        conexion.rollback()
        print(f"Error al crear gasto: {e}")
        raise Exception("Error de base de datos")
    finally:
        conexion.close()

def obtener_gastos(user_id, nombre_categoria=None):
    conexion = create_connection()
    
    if not conexion:
        return None
    
    try:
        with conexion.cursor() as cursor:
            if nombre_categoria:
                sql = """SELECT g.id, g.monto_gasto, g.descripcion, g.fecha, c.nombre 
                         FROM gastos g JOIN categorias c ON g.id_categoria = c.id
                         WHERE g.id_usuario = %s AND c.categoria = %s
                         ORDER BY g.fecha DESC"""
                cursor.execute(sql, (user_id, nombre_categoria))
            else:
                sql = """SELECT g.id, g.monto_gasto, g.descripcion, g.fecha, c.nombre 
                         FROM gastos g JOIN categorias c ON g.id_categoria = c.id
                         WHERE g.id_usuario = %s
                         ORDER BY g.fecha DESC"""
                cursor.execute(sql, (user_id,))
            return cursor.fetchall()
    except Exception as e:
        print(f"Error al obtener gastos: {e}")
        raise Exception("Error de base de datos")
    finally:
        conexion.close()

def eliminar_gasto(gasto_id, user_id):
    conexion = create_connection()
    
    if not conexion:
        return None
    
    try:
        with conexion.cursor() as cursor:
            sql = "DELETE FROM gastos WHERE id = %s AND id_usuario = %s"
            cursor.execute(sql, (gasto_id, user_id))
            conexion.commit()
            return cursor.rowcount > 0
    except Exception as e:
        conexion.rollback()
        print(f"Error al eliminar gasto: {e}")
        raise Exception("Error de base de datos")
    finally:
        conexion.close()