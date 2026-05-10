import os
import secrets
from passlib.context import CryptContext
from models import usuario_model
from utils.exceptions import CredencialesError, CuentaNoVerificadaError, UsuarioNoExiste , TokenInvalido, EmailDuplicado, PasswordNoCoinciden
from utils import mail
from jose import jwt, JWTError, ExpiredSignatureError
from datetime import datetime, timedelta, timezone


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def usuario_login(email, password):
    try:
        usuario = usuario_model.buscar_usuario_por_email(email)
        
        if not usuario or not pwd_context.verify(password, usuario["password"]):
            raise CredencialesError("Credenciales incorrectas")
        
        if not usuario["verificado"]:
            raise CuentaNoVerificadaError("Cuentan no verificada")
        
        token = crear_token({"id": usuario["id"]})
        
        if not token:
            raise Exception("Error interno")
        
        usuario["token"] = token
        usuario.pop("password", None)
        return usuario

    except CredencialesError:
        raise
    except CuentaNoVerificadaError:
        raise
    except Exception as e:
        print(f"Error en service login: {e}")
        raise Exception("Error interno")

async def crear_usuario(datos):
   
    try:
        
        existe = usuario_model.buscar_usuario_por_email(datos.email)
    
        if existe:
            raise EmailDuplicado("El email ya está registrado")
        
        password_hasheado = pwd_context.hash(datos.password)
        
        token_verificacion = secrets.token_urlsafe(32)
        print(f"Llamando a crear_usuario con: {datos.nickname}, {datos.email}")
        nuevo = usuario_model.crear_usuario(
            nombre_usuario=datos.nickname,
            email=datos.email,
            password=password_hasheado,
            presupuesto=datos.presupuesto,
            token_verificacion=token_verificacion
        )
        
        if not nuevo:
            raise Exception("Error al crear usuario")
        
        await mail.enviar_mail_verificacion(datos.email, token_verificacion)
        
        return nuevo

    except Exception as e:
        print(f"Error en service registro: {e}")
        raise Exception("Error interno")

def verificar_usuario(token):
    try:
        verificado = usuario_model.verificar_usuario(token)
        if not verificado:
            raise TokenInvalido("El token es invalido o ya ha sido utilizado")
        return verificado
    
    except TokenInvalido:
        raise
    
    except Exception as e:
        print(f"Error en service registro: {e}")
        raise Exception("Error interno")

def crear_token(data:dict):
    datos = data.copy()
    expiracion = datetime.now(timezone.utc) + timedelta(hours=24)
    datos.update({"exp": expiracion})
    token = jwt.encode(datos, os.getenv("SECRET_KEY"), algorithm="HS256")
    return token
 
def crear_token_recuperacion(data:dict):
    datos = data.copy()
    expiracion = datetime.now(timezone.utc) + timedelta(hours=1)
    datos.update({"exp": expiracion})
    token = jwt.encode(datos, os.getenv("SECRET_KEY"), algorithm="HS256")
    return token   

async def solicitar_recuperacion(email):
    try:
        usuario = usuario_model.buscar_usuario_por_email(email)
        
        if not usuario:
            raise UsuarioNoExiste("No existe el usuario")
        
        token = crear_token_recuperacion({"id": usuario["id"]})
        
        
        await mail.enviar_mail_recuperacion(email,token)
    
    except UsuarioNoExiste:
        raise
    
    except Exception as e:
        print(f"Error en recuperacion contraseña: {e}")
        raise Exception("Error interno")
        

def cambiar_contraseña(token, new_password, confirm_password):
    try:
        if new_password != confirm_password:
            raise PasswordNoCoinciden("Las contraseñas deben coincidir")
        
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
        user_id = payload["id"]
        
        new_pass_hasheada = pwd_context.hash(new_password)
        cambiada = usuario_model.cambiar_contraseña(new_pass_hasheada, user_id)
        
        return cambiada
        
    except ExpiredSignatureError:
        raise TokenInvalido("El token ha caducado")
    except JWTError:
        raise TokenInvalido("Token inválido")
    except PasswordNoCoinciden:
        raise
    except TokenInvalido:
        raise
    except Exception as e:
        print(f"Error al intentar cambiar contraseña: {e}")
        raise Exception("Error interno")
        
        