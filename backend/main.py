from dotenv import load_dotenv
load_dotenv()
import os
from fastapi import FastAPI, staticfiles
from fastapi.staticfiles import StaticFiles
from api.routes import router_usuario, router_categoria, router_gastos, router_perfil


app = FastAPI(title="App Control-Cartos")

os.makedirs("uploads/fotos", exist_ok=True)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(router_usuario, prefix="/usuario", tags=["Usuarios"])

app.include_router(router_categoria, prefix="/usuario/categorias", tags=["Categorias"])

app.include_router(router_gastos, prefix="/usuario/gastos", tags=["Gastos"])

app.include_router(router_perfil, prefix="/usuario/perfil", tags=["Perfil"])

@app.get("/")
def root():
    return {"Server funcionando"}
print("server levantado")
