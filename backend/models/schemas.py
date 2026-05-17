from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str
    password: str

class VerificarDuplicado(BaseModel):
    email: str

class RegisterRequest(BaseModel):
    nickname: str
    email: str
    password: str
    confirm_password: str
    presupuesto: float

class CambioRequest(BaseModel):
    new_password: str
    confirm_password: str

class CategoriaRequest(BaseModel):
    nombre: str
    monto_maximo: float
    
class GastosRequest(BaseModel):
    nombre_categoria: str
    monto: float
    descripcion: str | None = None
    
class NicknameRequest(BaseModel):
    nickname: str

class PasswordRequest(BaseModel):
    actual_password: str
    new_password: str
    confirm_password: str

class PresupuestoRequest(BaseModel):
    presupuesto: float