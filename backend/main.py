from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from api.routes import router_usuario, router_categoria


app = FastAPI(title="App Control-Cartos")



app.include_router(router_usuario, prefix="/usuario", tags=["Usuarios"])

app.include_router(router_categoria, prefix="/usuario/categorias", tags=["Categorias"])

@app.get("/")
def root():
    return {"Server funcionando"}
print("server levantado")