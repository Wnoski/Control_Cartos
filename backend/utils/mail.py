import os
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT")),
    MAIL_SERVER=os.getenv("MAIL_HOST"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)

async def enviar_mail_verificacion(email, token):
    try:
        url = f"http://127.0.0.1:5500/fronted/verificado.html?token={token}"
        mensaje = MessageSchema(
            subject="Verificacion de cuenta",
            recipients=[email],
            body=f"""<div style="font-family:sans-serif; max-width:500px; margin:auto; padding:20px;">
                <h2 style="color:#2ecc71;">Control Cartos</h2>
                <p>Hola, gracias por registrarte.</p>
                <p>Haz click en el botón para verificar tu cuenta:</p>
                <a href="{url}" style="background:#2ecc71; color:white; padding:12px 24px; 
                border-radius:8px; text-decoration:none; display:inline-block;">
                Verificar cuenta
                </a>
                <p style="color:#888; font-size:12px;">Si no te registraste ignora este email.</p>
            </div>""",
            subtype="html"
        )
        fm = FastMail(conf)
        await fm.send_message(mensaje)
        return True
    except Exception as e:
        print(f"Error al enviar mail: {e}")
        raise Exception("Error al enviar email de verificación")
        
async def enviar_mail_recuperacion(email, token):
    try:
        url = f"http://127.0.0.1:5500/frontend/cambiarContraseña.html?token={token}"
        mensaje = MessageSchema(
            subject= "Cambio de contraseña",
            recipients=[email],
            body=f"""<div style="font-family:sans-serif; max-width:500px; margin:auto; padding:20px;">
                <h2 style="color:#2ecc71;">Control Cartos</h2>
                <p>Cambio de contraseña</p>
                <p>Haz click en el botón para cambiar tu contraseña:</p>
                <a href="{url}" style="background:#2ecc71; color:white; padding:12px 24px; 
                border-radius:8px; text-decoration:none; display:inline-block;">
                Cambiar Contraseña
                </a>
                <p style="color:#888; font-size:12px;">Si no te registraste ignora este email.</p>
            </div>""",
            subtype= "html"
        )
        fm = FastMail(conf)
        await fm.send_message(mensaje)
        return True
    except Exception as e:
        print(f"Error al enviar mail: {e}")
        raise Exception("Error al enviar email de cambio de contraseña")