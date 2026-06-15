// ==========================================
// 1. REFERENCIAS AL DOM
// ==========================================
const accionIndex = document.getElementById("inicioRegistro");

// ==========================================
// 2. EVENT LISTENERS (INTERACCIONES)
// ==========================================
accionIndex.addEventListener("click", (e) => {
  if (e.target.id === "btnIniciarSesion") {
    window.location = "iniciarSesion.html";
  } else if (e.target.id === "btnRegistrarse") {
    window.location = "registrarse.html";
  }
});
