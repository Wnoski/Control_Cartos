import os
import uuid
from fastapi import HTTPException, UploadFile
from models import perfil_model
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def obtener_perfil(user_id):
    try:
        perfil = perfil_model.obtener_perfil(user_id)
        if not perfil:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        perfil.pop("password", None)
        return {"status": "success", "data": perfil}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error al obtener perfil: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

def cambiar_nickname(user_id, nickname):
    try:
        perfil_model.cambiar_nickname(user_id, nickname)
        return {"status": "success", "mensaje": "Nickname actualizado correctamente"}
    except Exception as e:
        print(f"Error al cambiar nickname: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

def cambiar_password(user_id, actual_password, password, confirm_password):
    try:
        perfil = perfil_model.obtener_perfil(user_id)
        
        if not perfil:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
        if not pwd_context.verify(actual_password, perfil["password"]):
            raise HTTPException(status_code=401, detail="Contraseña actual incorrecta")
        
        if password != confirm_password:
            raise HTTPException(status_code=400, detail="Las contraseñas no coinciden")
        
        password_hasheada = pwd_context.hash(password)
        perfil_model.cambiar_password(user_id, password_hasheada)
       
        return {"status": "success", "mensaje": "Contraseña actualizada correctamente"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error al cambiar password: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

def cambiar_presupuesto(user_id, presupuesto):
    try:
        perfil_model.cambiar_presupuesto(user_id, presupuesto)
        return {"status": "success", "mensaje": "Presupuesto actualizado correctamente"}
    except Exception as e:
        print(f"Error al cambiar presupuesto: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

async def cambiar_foto(user_id, foto: UploadFile):
    try:
        extensiones_permitidas = ["image/jpeg", "image/png", "image/webp"]
        if foto.content_type not in extensiones_permitidas:
            raise HTTPException(status_code=400, detail="Formato de imagen no permitido")
        
        extension = foto.filename.split(".")[-1]
        nombre_archivo = f"{uuid.uuid4()}.{extension}"
        ruta = f"uploads/fotos/{nombre_archivo}"
        
        contenido = await foto.read()
        with open(ruta, "wb") as f:
            f.write(contenido)
        
        perfil_model.cambiar_foto(user_id, ruta)
        return {"status": "success", "mensaje": "Foto actualizada correctamente", "url": ruta}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error al cambiar foto: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

def eliminar_cuenta(user_id):
    try:
        perfil_model.eliminar_cuenta(user_id)
        return {"status": "success", "mensaje": "Cuenta eliminada correctamente"}
    except Exception as e:
        print(f"Error al eliminar cuenta: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")