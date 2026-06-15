from utils.exceptions import CredencialesError, CuentaNoVerificadaError, EmailDuplicado, TokenInvalido, UsuarioNoExiste, PasswordNoCoinciden, CategoriaNoExiste
from fastapi import HTTPException
from models import gastos_model, usuarios_model
from services import ocr_service 
from utils.exceptions import NoProcesado

def crear_gasto(nombre_categoria, user_id, monto, descripcion = None):
    try:
        id_categoria = gastos_model.obtener_id_categoria(user_id, nombre_categoria)
        
        if not id_categoria:
            raise CategoriaNoExiste("No existe esa categoria")
        
        gastos_model.crear_gasto(user_id, id_categoria, monto, descripcion)
        
        return {
            "status": "success"
        }
        
    except CategoriaNoExiste as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    except Exception as e:
        print(f"Error en el controller gasto: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")
    
def obtener_gastos_de_usuario(user_id):
    try:
        gastos = gastos_model.obtener_gastos(user_id)
        return {"status": "success", "data": gastos}
    except Exception as e:
        print(f"Error al obtener gastos: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")


def eliminar_gasto_de_usuario(gasto_id, user_id):
    try:
        gastos_model.eliminar_gasto(gasto_id, user_id)
        return {"status": "success", "mensaje": "Gasto eliminado correctamente"}
    except Exception as e:
        print(f"Error al eliminar gasto: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")


def editar_gasto(user_id, gasto_id, datos):
    try:
        id_categoria = gastos_model.obtener_id_categoria(user_id, datos["nombre_categoria"])
        datos.pop("nombre_categoria")
        datos.update({"id_categoria": id_categoria})
        gastos_model.editar_gasto(user_id, gasto_id, datos)
        return {"status": "success", "mensaje": "Gasto editado correctamente"}
    except Exception as e:
        print(f"Error al editar gasto: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")
    

def procesar_gasto_ocr(archivo, user_id):
    try:
        procesado = ocr_service.extraer_texto(archivo)
        
        if not procesado:
            raise NoProcesado("No se pudo procesar el archivo, intente manualmente por favor")
        
        return {
            "status":"success",
            "data": procesado
        }
        
    except NoProcesado as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    except Exception as e:
        print(f"Error al procesar OCR: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")