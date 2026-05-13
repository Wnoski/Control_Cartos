from fastapi import APIRouter, Depends, UploadFile, File
from controllers import auth_controller, categoria_controller, gastos_controller, perfil_controller
from models.schemas import LoginRequest, RegisterRequest, CambioRequest, CategoriaRequest, GastosRequest, NicknameRequest, EmailRequest, PasswordRequest, PresupuestoRequest
from utils.auth import verificar_token

router_usuario = APIRouter()


#USER
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


#GASTOS

router_gastos = APIRouter()

@router_gastos.get("/")
def obtener_gastos(user_id: int = Depends(verificar_token), nombre_categoria: str | None = None):
    return gastos_controller.obtener_gastos_de_usuario(user_id, nombre_categoria)

@router_gastos.post("/")
def crear_gasto(datos: GastosRequest, user_id: int = Depends(verificar_token)):
    return gastos_controller.crear_gasto(datos.nombre_categoria, user_id, datos.monto, datos.descripcion)

@router_gastos.delete("/{gasto_id}")
def eliminar_gasto(gasto_id: int, user_id: int = Depends(verificar_token)):
    return gastos_controller.eliminar_gasto_de_usuario(gasto_id, user_id)


#PERFIL USUARIOS

router_perfil = APIRouter()

@router_perfil.get("/")
def obtener_perfil(user_id: int = Depends(verificar_token)):
    return perfil_controller.obtener_perfil(user_id)

@router_perfil.put("/nickname")
def cambiar_nickname(datos: NicknameRequest, user_id: int = Depends(verificar_token)):
    return perfil_controller.cambiar_nickname(user_id, datos.nickname)

@router_perfil.put("/email")
def cambiar_email(datos: EmailRequest, user_id: int = Depends(verificar_token)):
    return perfil_controller.cambiar_email(user_id, datos.email)

@router_perfil.put("/password")
def cambiar_password(datos: PasswordRequest, user_id: int = Depends(verificar_token)):
    return perfil_controller.cambiar_password(user_id, datos.actual_password, datos.new_password, datos.confirm_password)

@router_perfil.put("/presupuesto")
def cambiar_presupuesto(datos: PresupuestoRequest, user_id: int = Depends(verificar_token)):
    return perfil_controller.cambiar_presupuesto(user_id, datos.presupuesto)

@router_perfil.put("/foto")
def cambiar_foto(user_id: int = Depends(verificar_token), foto: UploadFile = File(...)):
    return perfil_controller.cambiar_foto(user_id, foto)

@router_perfil.delete("/")
def eliminar_cuenta(user_id: int = Depends(verificar_token)):
    return perfil_controller.eliminar_cuenta(user_id)

