// ==========================================
// 1. REFERENCIAS AL DOM
// ==========================================
const inputEmail = document.getElementById("email");
const btnEnviar = document.getElementById("btnEnviar");

// ==========================================
// 2. SERVICIOS Y PETICIONES API
// ==========================================
async function enviarCorreoRecuperacion(email) {
  try {
    const res = await fetch(`${URL_BASE}/usuarios/olvidar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error al intentar enviar correo de recuperacion:", error);
  }
}

// ==========================================
// 3. EVENT LISTENERS (INTERACCIONES)
// ==========================================
btnEnviar.addEventListener("click", async () => {
  const email = inputEmail.value.trim();

  if (!email) {
    notificar("Por favor, ingrese su correo electrónico.", "error");
    return;
  }

  const enviado = await enviarCorreoRecuperacion(email);

  if (enviado) {
    inputEmail.value = "";
    notificar(
      "Correo enviado correctamente. Revisa tu bandeja de entrada y sigue los pasos.",
      "success",
    );
  } else {
    notificar(
      "Error al enviar correo de recuperación. Por favor, intente nuevamente.",
      "error",
    );
  }
});
