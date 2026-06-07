const accionIndex = document.getElementById("inicioRegistro");

accionIndex.addEventListener("click", (e) => {
  if (e.target.id === "btnIniciarSesion") {
    window.location = "iniciarSesion.html";
  } else if (e.target.id === "btnRegistrarse") {
    window.location = "registrarse.html";
  }
});
