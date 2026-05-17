from config.database import create_connection

def obtener_dashboard_mes_actual(user_id):
    conexion = create_connection()
    
    if not conexion:
        return None
    
    try:
        with conexion.cursor() as cursor:
            sql = """
                SELECT 
                    c.id,
                    c.categoria,
                    c.monto_maximo,
                    COALESCE(SUM(g.gasto), 0) as total_gastado
                FROM categorias c
                LEFT JOIN gastos g ON c.id = g.id_categoria 
                    AND MONTH(g.fecha) = MONTH(CURRENT_DATE())
                    AND YEAR(g.fecha) = YEAR(CURRENT_DATE())
                WHERE c.id_usuario = %s
                GROUP BY c.id, c.categoria, c.monto_maximo
            """
            cursor.execute(sql, (user_id,))
            return cursor.fetchall()
    except Exception as e:
        print(f"Error al obtener dashboard mes actual: {e}")
        raise Exception("Error de base de datos")
    finally:
        conexion.close()

def obtener_dashboard_mes_anterior(user_id):
    conexion = create_connection()
    
    if not conexion:
        return None
    
    try:
        with conexion.cursor() as cursor:
            sql = """
                SELECT 
                    c.id,
                    c.categoria,
                    c.monto_maximo,
                    COALESCE(SUM(g.gasto), 0) as total_gastado
                FROM categorias c
                LEFT JOIN gastos g ON c.id = g.id_categoria 
                    AND MONTH(g.fecha) = MONTH(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH))
                    AND YEAR(g.fecha) = YEAR(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH))
                WHERE c.id_usuario = %s
                GROUP BY c.id, c.categoria, c.monto_maximo
            """
            cursor.execute(sql, (user_id,))
            return cursor.fetchall()
    except Exception as e:
        print(f"Error al obtener dashboard mes anterior: {e}")
        raise Exception("Error de base de datos")
    finally:
        conexion.close()

def obtener_historico_3_meses(user_id):
    conexion = create_connection()
    
    if not conexion:
        return None
    
    try:
        with conexion.cursor() as cursor:
            sql = """
                SELECT 
                    MONTH(g.fecha) as mes,
                    YEAR(g.fecha) as año,
                    c.categoria,
                    COALESCE(SUM(g.gasto), 0) as total_gastado
                FROM gastos g
                JOIN categorias c ON g.id_categoria = c.id
                WHERE g.id_usuario = %s
                    AND g.fecha >= DATE_SUB(CURRENT_DATE(), INTERVAL 3 MONTH)
                GROUP BY YEAR(g.fecha), MONTH(g.fecha), c.id, c.categoria
                ORDER BY YEAR(g.fecha), MONTH(g.fecha)
            """
            cursor.execute(sql, (user_id,))
            return cursor.fetchall()
    except Exception as e:
        print(f"Error al obtener historico: {e}")
        raise Exception("Error de base de datos")
    finally:
        conexion.close()

def obtener_presupuesto_usuario(user_id):
    conexion = create_connection()
    
    if not conexion:
        return None
    
    try:
        with conexion.cursor() as cursor:
            sql = "SELECT presupuesto_maximo_mensual FROM usuarios WHERE id = %s"
            cursor.execute(sql, (user_id,))
            return cursor.fetchone()
    except Exception as e:
        print(f"Error al obtener presupuesto: {e}")
        raise Exception("Error de base de datos")
    finally:
        conexion.close()