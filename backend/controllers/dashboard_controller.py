from fastapi import HTTPException
from models import dashboard_model

def calcular_mensaje(porcentaje):
    if porcentaje >= 100:
        return {"emoji": "🔴", "mensaje": "Límite superado"}
    elif porcentaje >= 75:
        return {"emoji": "🟡", "mensaje": "Cerca del límite"}
    else:
        return {"emoji": "🟢", "mensaje": "Vas bien"}

def obtener_dashboard(user_id):
    try:
        categorias = dashboard_model.obtener_dashboard_mes_actual(user_id)
        presupuesto = dashboard_model.obtener_presupuesto_usuario(user_id)
        
        total_gastado_global = 0
        resultado_categorias = []
        
        for categoria in categorias:
            total_gastado = float(categoria["total_gastado"])
            monto_maximo = float(categoria["monto_maximo"]) if categoria["monto_maximo"] else 0
            
            porcentaje = (total_gastado / monto_maximo * 100) if monto_maximo > 0 else 0
            feedback = calcular_mensaje(porcentaje)
            total_gastado_global += total_gastado
            
            resultado_categorias.append({
                "id": categoria["id"],
                "categoria": categoria["nombre"],
                "monto_maximo": monto_maximo,
                "total_gastado": total_gastado,
                "porcentaje": round(porcentaje, 1),
                "emoji": feedback["emoji"],
                "mensaje": feedback["mensaje"]
            })
        
        presupuesto_maximo = float(presupuesto["presupuesto_maximo_mensual"]) if presupuesto else 0
        porcentaje_global = (total_gastado_global / presupuesto_maximo * 100) if presupuesto_maximo > 0 else 0
        feedback_global = calcular_mensaje(porcentaje_global)
        
        return {
            "status": "success",
            "data": {
                "presupuesto_maximo": presupuesto_maximo,
                "total_gastado_global": round(total_gastado_global, 2),
                "porcentaje_global": round(porcentaje_global, 1),
                "emoji_global": feedback_global["emoji"],
                "mensaje_global": feedback_global["mensaje"],
                "categorias": resultado_categorias
            }
        }
    except Exception as e:
        print(f"Error en dashboard: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

def obtener_dashboard_mes_anterior(user_id):
    try:
        categorias = dashboard_model.obtener_dashboard_mes_anterior(user_id)
        presupuesto = dashboard_model.obtener_presupuesto_usuario(user_id)
        
        total_gastado_global = 0
        resultado_categorias = []
        
        for categoria in categorias:
            total_gastado = float(categoria["total_gastado"])
            monto_maximo = float(categoria["monto_maximo"]) if categoria["monto_maximo"] else 0
            porcentaje = (total_gastado / monto_maximo * 100) if monto_maximo > 0 else 0
            feedback = calcular_mensaje(porcentaje)
            total_gastado_global += total_gastado
            
            resultado_categorias.append({
                "id": categoria["id"],
                "categoria": categoria["nombre"],
                "monto_maximo": monto_maximo,
                "total_gastado": total_gastado,
                "porcentaje": round(porcentaje, 1),
                "emoji": feedback["emoji"],
                "mensaje": feedback["mensaje"]
            })
        
        presupuesto_maximo = float(presupuesto["presupuesto_maximo_mensual"]) if presupuesto else 0
        porcentaje_global = (total_gastado_global / presupuesto_maximo * 100) if presupuesto_maximo > 0 else 0
        feedback_global = calcular_mensaje(porcentaje_global)
        
        return {
            "status": "success",
            "data": {
                "presupuesto_maximo": presupuesto_maximo,
                "total_gastado_global": round(total_gastado_global, 2),
                "porcentaje_global": round(porcentaje_global, 1),
                "emoji_global": feedback_global["emoji"],
                "mensaje_global": feedback_global["mensaje"],
                "categorias": resultado_categorias
            }
        }
    except Exception as e:
        print(f"Error en dashboard mes anterior: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

def obtener_historico(user_id):
    try:
        historico = dashboard_model.obtener_historico_3_meses(user_id)
        return {"status": "success", "data": historico}
    except Exception as e:
        print(f"Error en historico: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")