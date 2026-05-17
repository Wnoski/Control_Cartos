const accionIndex = document.getElementById("inicioRegistro");

accionIndex.addEventListener("click", (e) => {
  console.log("click");
  if (e.target.id === "btnIniciarSesion") {
    window.location = "iniciarSesion.html";
  } else if (e.target.id === "btnRegistrarse") {
    window.location = "registro.html";
  }
});
