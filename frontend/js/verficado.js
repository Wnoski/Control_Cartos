document.addEventListener("DOMContentLoaded", async () => {
  const token = extraerToken();
  if (token) {
    try {
      const userData = await verificarToken(token);
    } catch (error) {
      console.error("Error al verificar el token:", error);
    }
  }
});

const divVerificado = document.getElementById("divVerificado");
const divError = document.getElementById("divError");

function extraerToken() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  return token;
}

async function verificarToken(token) {
  try {
    const res = await fetch(`${URL_BASE}/usuarios/verificar/${token}`);

    if (res.ok) {
      divVerificado.classList.remove("d-none");
      setTimeout(() => {
        window.location.replace("iniciarSesion.html");
      }, 10000);
    } else {
      divError.classList.remove("d-none");
      setTimeout(() => {
        window.location.replace("index.html");
      }, 10000);
    }
  } catch (error) {
    console.error("Error al verificar el token:", error);
  }
}
