from fastapi import FastAPI
from api.routes import router_usuario

app = FastAPI(title="App Control-Cartos")

app.include_router(router_usuario, prefix="/usuario", tags=["Usuarios"])


@app.get("/")
def root():
    return {"Server funcionando"}

print("server levantado")