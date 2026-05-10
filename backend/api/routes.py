from fastapi import APIRouter
from controllers import auth_controller
from models.auth_model import LoginRequest, RegisterRequest, CambioRequest

router_usuario = APIRouter()

@router_usuario.post("/login")
def usuario_login(datos: LoginRequest):
    return auth_controller.usuario_login(datos.email, datos.password)
    
@router_usuario.post("/register")
async def usuario_regis(datos: RegisterRequest):
    return await auth_controller.crear_usuario(datos)

@router_usuario.get("/verificar/{token}")
def verificar_cuenta(token: str):
    return auth_controller.verificar_cuenta(token)

@router_usuario.post("/olvidar")
async def solicitar_cambio_contraseña(email: str):
    return await auth_controller.solicitar_cambio(email)

@router_usuario.post("/cambiar/{token}")
async def solicitar_cambio_contraseña(token: str, datos: CambioRequest):
    return auth_controller.cambiar_contraseña(token, datos.new_password, datos.confirm_password)
