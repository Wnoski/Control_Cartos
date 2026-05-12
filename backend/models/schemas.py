from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str
    password: str
    
class RegisterRequest(BaseModel):
    nickname: str
    email: str
    password: str
    presupuesto: int

class CambioRequest(BaseModel):
    new_password: str
    confirm_password: str

class CategoriaRequest(BaseModel):
    nombre: str
    monto_maximo: float