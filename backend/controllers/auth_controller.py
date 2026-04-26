from utils.exceptions import CredencialesError, CuentaNoVerificadaError
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
                "email": usuario["email"]
            }
        }
    
    except CredencialesError as e:
        raise HTTPException(status_code=401, detail=str(e))
    
    except CuentaNoVerificadaError as e:
        raise HTTPException(status_code=403, detail= str(e))
    
    except Exception as e:
        print(f"Error interno {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")
