from fastapi import APIRouter
from controllers import auth_controller
from models.pydantic import LoginRequest

router_usuario = APIRouter()

@router_usuario.post("/login")
def usuario_login(datos: LoginRequest):
    return auth_controller.usuario_login(datos.email, datos.password)
    