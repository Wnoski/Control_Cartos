const inputEmail = document.getElementById("email");
const btnEnviar = document.getElementById("btnEnviar");

btnEnviar.addEventListener("click", async () => {
  const email = inputEmail.value.trim();
  console.log("click");
  if (!email) {
    alert("Por favor, ingrese su correo electrónico.");
    return;
  }

  const enviado = await enviarCorreoRecuperacion(email);

  if (enviado) {
    alert("enviado");
    // new PNotify({
    //   title: "Enviado",
    //   text: "Correo enviado correctamente revisa tu bandeja de entrada y sigue los pasos",
    //   type: "succes",
    // });
  } else {
    alert("error");
    // new PNotify({
    //   title: "Error",
    //   text: "Error al intentar enviar correo de recuperacion",
    //   type: "error",
    // });
  }
});

async function enviarCorreoRecuperacion(email) {
  try {
    const res = await fetch("http://127.0.0.1:8000/usuarios/olvidar", {
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
