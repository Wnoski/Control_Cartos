from passlib.context import CryptContext
from models import usuario_model
from utils.exceptions import CredencialesError, CuentaNoVerificadaError

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def usuario_login(email, password):
    try:
        usuario = usuario_model.buscar_usuario_por_email(email)
        
        if not usuario or not pwd_context.verify(password, usuario["password"]):
            raise CredencialesError("Credenciales incorrectas")
        
        if not usuario["verificado"]:
            raise CuentaNoVerificadaError("Cuentan no verificada")
        
        return usuario

    except CredencialesError:
        raise
    except CuentaNoVerificadaError:
        raise
    except Exception as e:
        print(f"Error en service login: {e}")
        raise Exception("Error interno")