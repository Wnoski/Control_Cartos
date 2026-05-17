from dotenv import load_dotenv
load_dotenv()
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from api.routes import router_usuario, router_categoria, router_gastos, router_perfil, router_dashboard


app = FastAPI(title="App Control-Cartos")

origins = [
    "http://127.0.0.1:5500"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*'],
)

os.makedirs("uploads/fotos", exist_ok=True)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(router_usuario, prefix="/usuarios", tags=["Usuarios"])

app.include_router(router_categoria, prefix="/categorias", tags=["Categorias"])

app.include_router(router_gastos, prefix="/gastos", tags=["Gastos"])

app.include_router(router_perfil, prefix="/perfil", tags=["Perfil"])

app.include_router(router_dashboard, prefix="/dashboard", tags=["Dashboard"])

@app.get("/")
def root():
    return {"Server funcionando"}
print("server levantado")
