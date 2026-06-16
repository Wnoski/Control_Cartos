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
        url = f"http://127.0.0.1:5500/frontend/verificado.html?token={token}"
        mensaje = MessageSchema(
            subject="Verificacion de cuenta",
            recipients=[email],
            body=f"""<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width:500px; margin:auto; padding:40px 20px; background-color:#f8f9fa;">
    <div style="background:white; border-radius:12px; padding:40px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        
        <!-- HEADER -->
        <div style="text-align:center; margin-bottom:32px;">
            <h1 style="font-size:24px; font-weight:700; color:#212529; margin:0;">
                CONTROL <span style="color:#2ecc71;">CARTOS</span>
            </h1>
        </div>

        <!-- ICONO -->
        <div style="text-align:center; margin-bottom:24px;">
            <div style="width:64px; height:64px; background:#d1f5e0; border-radius:50%; margin:auto; display:flex; align-items:center; justify-content:center;">
                <span style="font-size:32px;">✉️</span>
            </div>
        </div>

        <!-- MAIN -->
        <h2 style="font-size:20px; font-weight:600; color:#212529; text-align:center; margin-bottom:12px;">
            Verifica tu cuenta
        </h2>
        <p style="color:#6c757d; font-size:14px; text-align:center; margin-bottom:32px;">
            Hola, gracias por registrarte en Control Cartos. Haz click en el botón para activar tu cuenta.
        </p>

        <!-- BOTÓN -->
        <div style="text-align:center; margin-bottom:32px;">
            <a href="{url}" style="background:#2ecc71; color:white; padding:14px 32px; 
            border-radius:8px; text-decoration:none; display:inline-block; 
            font-weight:600; font-size:15px;">
                Verificar cuenta
            </a>
        </div>

        <!-- DIVIDER -->
        <hr style="border:none; border-top:1px solid #dee2e6; margin-bottom:24px;"/>

        <!-- PFOOTER -->
        <p style="color:#adb5bd; font-size:12px; text-align:center; margin:0;">
            Si no te registraste en Control Cartos ignora este email.
        </p>

    </div>
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
            body=f"""<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width:500px; margin:auto; padding:40px 20px; background-color:#f8f9fa;">
    <div style="background:white; border-radius:12px; padding:40px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        
        <!-- HEADER -->
        <div style="text-align:center; margin-bottom:32px;">
            <h1 style="font-size:24px; font-weight:700; color:#212529; margin:0;">
                CONTROL <span style="color:#2ecc71;">CARTOS</span>
            </h1>
        </div>

        <!-- ICONO -->
        <div style="text-align:center; margin-bottom:24px;">
            <div style="width:64px; height:64px; background:#fde8e8; border-radius:50%; margin:auto;">
                <span style="font-size:32px; line-height:64px;">🔐</span>
            </div>
        </div>

        <!-- MAIN -->
        <h2 style="font-size:20px; font-weight:600; color:#212529; text-align:center; margin-bottom:12px;">
            Cambio de contraseña
        </h2>
        <p style="color:#6c757d; font-size:14px; text-align:center; margin-bottom:32px;">
            Recibimos una solicitud para restablecer la contraseña de tu cuenta. Haz click en el botón para continuar. Si no fuiste tú, ignora este email.
        </p>

        <!-- BOTÓN -->
        <div style="text-align:center; margin-bottom:32px;">
            <a href="{url}" style="background:#0d6efd; color:white; padding:14px 32px; 
            border-radius:8px; text-decoration:none; display:inline-block; 
            font-weight:600; font-size:15px;">
                Cambiar contraseña
            </a>
        </div>

        <!-- WARNING -->
        <div style="background:#fff3cd; border-radius:8px; padding:12px 16px; margin-bottom:24px;">
            <p style="color:#856404; font-size:13px; margin:0;">
                ⚠️ Este enlace expirará en 1 hora por seguridad.
            </p>
        </div>

        <!-- DIVIDER -->
        <hr style="border:none; border-top:1px solid #dee2e6; margin-bottom:24px;"/>

        <!-- FOOTER -->
        <p style="color:#adb5bd; font-size:12px; text-align:center; margin:0;">
            Si no solicitaste un cambio de contraseña ignora este email.
        </p>

    </div>
</div>""",
            subtype= "html"
        )
        fm = FastMail(conf)
        await fm.send_message(mensaje)
        return True
    except Exception as e:
        print(f"Error al enviar mail: {e}")
        raise Exception("Error al enviar email de cambio de contraseña")