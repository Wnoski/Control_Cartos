from fastapi import HTTPException
from models import categoria_model

def obtener_categorias_de_usuario(user_id):
    try:
        categorias = categoria_model.obtener_categorias(user_id)
        return {"status": "success", "data": categorias}
    except Exception as e:
        print(f"Error al obtener categorias: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

def crear_categoria_de_usuario(user_id, nombre, monto_maximo):
    try:
        categoria_model.crear_categoria(user_id, nombre, monto_maximo)
        return {"status": "success", "mensaje": "Categoría creada correctamente"}
    except Exception as e:
        print(f"Error al crear categoria: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

def editar_categoria_de_usuario(categoria_id, user_id, nombre, monto_maximo):
    try:
        categoria_model.editar_categoria(categoria_id, user_id, nombre, monto_maximo)
        return {"status": "success", "mensaje": "Categoría editada correctamente"}
    except Exception as e:
        print(f"Error al editar categoria: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

def eliminar_categoria_de_usuario(categoria_id, user_id):
    try:
        categoria_model.eliminar_categoria(categoria_id, user_id)
        return {"status": "success", "mensaje": "Categoría eliminada correctamente"}
    except Exception as e:
        print(f"Error al eliminar categoria: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")