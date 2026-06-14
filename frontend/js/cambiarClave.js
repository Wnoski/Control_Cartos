const form = document.getElementById("formRecuperar");
const nPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!nPassword.value || !confirmPassword.value) {
    notificar("Debes rellenar ambos campos", "error");
    return;
    po;
  }

  if (nPassword.value !== confirmPassword.value) {
    notificar("Ambas contraseñas deben coincidir", "error");
    return;
    n;
  }

  const botonSubmit = e.submitter;
  if (botonSubmit) {
    botonSubmit.disabled = true;
  }

  const token = extraerToken();

  const cambiar = await cambiarContraseña(
    token,
    nPassword.value,
    confirmPassword.value,
  );

  // 5. RESPUESTA DEL SERVIDOR
  if (cambiar) {
    form.reset();

    notificar(
      "Contraseña cambiada correctamente. Serás redirigido a iniciar sesión en breve.",
      "success",
    );

    setTimeout(() => {
      window.location.href = "IniciarSesion.html";
    }, 10000);
  } else {
    notificar(
      "Error al cambiar la contraseña. Por favor, intente nuevamente.",
      "error",
    );

    if (botonSubmit) {
      botonSubmit.disabled = false;
    }
  }
});

function extraerToken() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  return token;
}

async function cambiarContraseña(token, new_password, confirm_password) {
  try {
    const res = await fetch(`${URL_BASE}/usuarios/cambiar/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ new_password, confirm_password }),
    });

    if (res.ok) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error al intentar cambiar la contraseña", error);
    return false;
  }
}
