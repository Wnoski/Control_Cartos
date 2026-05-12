from fastapi import APIRouter, Depends
from controllers import auth_controller, categoria_controller
from models.schemas import LoginRequest, RegisterRequest, CambioRequest, CategoriaRequest
from utils.auth import verificar_token

router_usuario = APIRouter()


#USERS
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

#CATEGORIAS

router_categoria = APIRouter()

@router_categoria.get("/")
def obtener_categorias(user_id: int = Depends(verificar_token)):
    return categoria_controller.obtener_categorias_de_usuario(user_id)

@router_categoria.post("/")
def crear_categoria(datos: CategoriaRequest, user_id: int = Depends(verificar_token)):
    return categoria_controller.crear_categoria_de_usuario(user_id, datos.nombre, datos.monto_maximo)

@router_categoria.put("/{categoria_id}")
def editar_categoria(categoria_id: int, datos: CategoriaRequest, user_id: int = Depends(verificar_token)):
    return categoria_controller.editar_categoria_de_usuario(categoria_id, user_id, datos.nombre, datos.monto_maximo)

@router_categoria.delete("/{categoria_id}")
def eliminar_categoria(categoria_id: int, user_id: int = Depends(verificar_token)):
    return categoria_controller.eliminar_categoria_de_usuario(categoria_id, user_id)