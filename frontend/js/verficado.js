document.addEventListener("DOMContentLoaded", async () => {
  const token = extraerToken();
  if (token) {
    try {
      const userData = await veriricarToken(token);
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

async function veriricarToken(token) {
  try {
    const res = await fetch(
      `http://127.0.0.1:8000/usuarios/verificar/${token}`,
    );

    if (res.ok) {
      divVerificado.classList.remove("d-none");
      setTimeout(() => {
        window.location.href = "iniciarSesion.html";
      }, 4000);
    } else {
      divError.classList.remove("d-none");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 5000);
    }
  } catch (error) {
    console.error("Error al verificar el token:", error);
    throw error;
  }
}
