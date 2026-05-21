const form = document.getElementById("formRecuperar");
const nPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!nPassword.value || !confirmPassword.value) {
    alert("debes rellenar ambos campos");
    return;
  }

  if (nPassword.value != confirmPassword.value) {
    alert("ambas contraseñas deben coincidir");
  }
  const token = extraerToken();
  const cambiar = await cambiarContraseña(
    token,
    nPassword.value,
    confirmPassword.value,
  );

  if (cambiar) {
    alert("cambiada");
  } else {
    alert("no cambiada");
  }
});

function extraerToken() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  return token;
}

async function cambiarContraseña(token, new_password, confirm_password) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/usuarios/cambiar/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ new_password, confirm_password }),
    });

    if (res.ok) {
      return true;
      form.reset();
    }
  } catch (error) {
    console.error("Error al intentar cambiar la clave");
    return false;
  }
}
