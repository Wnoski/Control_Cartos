from utils.exceptions import CredencialesError, CuentaNoVerificadaError, EmailDuplicado, TokenInvalido, UsuarioNoExiste, PasswordNoCoinciden
from services import auth_service
from fastapi import HTTPException


def usuario_login(email, password):
    try:
        usuario = auth_service.usuario_login(email, password)
        return {
            "status": "success",
            "usuario": {
                "id": usuario["id"],
                "nombre_usuario": usuario["nombre_usuario"],
                "email": usuario["email"],
                "token": usuario["token"]
            }
        }
    
    except CredencialesError as e:
        raise HTTPException(status_code=401, detail=str(e))
    
    except CuentaNoVerificadaError as e:
        raise HTTPException(status_code=403, detail= str(e))
    
    except Exception as e:
        print(f"Error interno {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

async def crear_usuario(datos):
    print(f"Entrando al controller con: {datos}")
    try:
        await auth_service.crear_usuario(datos)
        return {"status": "success", "mensaje": "Usuario creado, revisa tu email"}
    except EmailDuplicado as e:
        raise HTTPException(status_code=409, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Error interno del servidor")

def verificar_cuenta(token):
    try:
        auth_service.verificar_usuario(token)
        return {"status": "success", "mensaje": "Usuario verificado correctamente ya puedes iniciar sesion"}
    except TokenInvalido as e:
        raise HTTPException(status_code=409, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Error interno del servidor")
    
async def solicitar_cambio(email):
    try:
        await auth_service.solicitar_recuperacion(email)
        
        return {
            "status" : "succes",
            "mensaje" : "Correo enviado correctamente"
        }
        
    except UsuarioNoExiste as e:
        raise HTTPException(status_code=404, detail= str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Error interno del servidor")

def cambiar_contraseña(token, new_password, confirm_password):
    try:
        auth_service.cambiar_contraseña(token, new_password, confirm_password)
        
        return {
            "status" : "success",
            "mensaje" : "Cambio contraseña realizado"
        }
        
    except PasswordNoCoinciden as e:
        raise HTTPException(status_code=400, detail= str(e))
    except TokenInvalido as e:
        raise HTTPException(status_code=401, detail= str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Error interno del servidor")