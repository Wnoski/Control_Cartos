function notificar(mensaje, tipo = "success") {
  const colores = {
    success: "alert-success",
    error: "alert-danger",
    warning: "alert-warning",
    info: "alert-info",
  };

  const alerta = document.createElement("div");
  alerta.className = `alert ${colores[tipo]} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
  alerta.style.zIndex = "9999";
  alerta.innerHTML = `
    ${mensaje}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;

  document.body.appendChild(alerta);
  setTimeout(() => alerta.remove(), 4000);
}
