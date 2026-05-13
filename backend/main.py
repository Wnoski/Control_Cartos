from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from api.routes import router_usuario, router_categoria, router_gastos


app = FastAPI(title="App Control-Cartos")



app.include_router(router_usuario, prefix="/usuario", tags=["Usuarios"])

app.include_router(router_categoria, prefix="/usuario/categorias", tags=["Categorias"])

app.include_router(router_gastos, prefix="/usuario/gastos", tags=["Gastos"])

app.include_router(router_perfil, prefix="/perfil", tags=["Perfil"])

@app.get("/")
def root():
    return {"Server funcionando"}
print("server levantado")
