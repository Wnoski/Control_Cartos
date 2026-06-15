// ==========================================
// 1. CONSTANTES Y ESTADO DE LA APLICACIÓN
// ==========================================
let token;

// ==========================================
// 2. REFERENCIAS AL DOM
// ==========================================
// Información del Perfil (Visualización)
const fotoPerfil = document.getElementById("fotoPerfil");
const nombreUsuario = document.getElementById("nombreUsuario");
const emailUsuario = document.getElementById("emailUsuario");

// Sección: Actualizar Foto e Información Básica
const inputFoto = document.getElementById("inputFoto");
const nuevoNickname = document.getElementById("nuevoNickname");
const btnGuardarNickname = document.getElementById("btnGuardarNickname");

// Sección: Cambio de Contraseña
const passwordActual = document.getElementById("passwordActual");
const passwordNueva = document.getElementById("passwordNueva");
const passwordConfirmar = document.getElementById("passwordConfirmar");
const btnGuardarPassword = document.getElementById("btnGuardarPassword");
const btnMostrar = document.getElementById("mostrarContraseña");

// Sección: Presupuesto
const nuevoPresupuesto = document.getElementById("nuevoPresupuesto");
const btnGuardarPresupuesto = document.getElementById("btnGuardarPresupuesto");

// Sección: Peligro / Eliminar Cuenta
const btnConfirmarEliminarCuenta = document.getElementById(
  "btnConfirmarEliminarCuenta",
);

// Instancias de Modales (Bootstrap)
const modalEliminarCuenta = bootstrap.Modal.getOrCreateInstance(
  document.getElementById("modalEliminarCuenta"),
);

// ==========================================
// 3. INICIALIZACIÓN DE LA APP
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
  token = await comprobarToken();

  const perfil = await obtenerDatosPerfil();
  renderPerfil(perfil);
});

// ==========================================
// 4. SERVICIOS Y PETICIONES API
// ==========================================
async function obtenerDatosPerfil() {
  try {
    const res = await fetch(`${URL_BASE}/perfil/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (error) {
    console.error("Error al obtener datos de perfil:", error);
  }
}

async function cambiarNickname(nickname) {
  try {
    const res = await fetch(`${URL_BASE}/perfil/nickname`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nickname }),
    });
    return res.ok;
  } catch (error) {
    console.error("Error al cambiar nickname:", error);
    return false;
  }
}

async function cambiarPassword(
  actual_password,
  new_password,
  confirm_password,
) {
  try {
    const res = await fetch(`${URL_BASE}/perfil/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ actual_password, new_password, confirm_password }),
    });
    return res.ok;
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    return false;
  }
}

async function cambiarPresupuesto(presupuesto) {
  try {
    const res = await fetch(`${URL_BASE}/perfil/presupuesto`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ presupuesto }),
    });
    return res.ok;
  } catch (error) {
    console.error("Error al cambiar presupuesto:", error);
    return false;
  }
}

async function cambiarFoto(foto) {
  try {
    const formData = new FormData();
    formData.append("foto", foto);
    const res = await fetch(`${URL_BASE}/perfil/foto`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
    return null;
  } catch (error) {
    console.error("Error al cambiar foto:", error);
    return null;
  }
}

async function eliminarCuenta() {
  try {
    const res = await fetch(`${URL_BASE}/perfil/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch (error) {
    console.error("Error al eliminar cuenta:", error);
    return false;
  }
}

// ==========================================
// 5. FUNCIONES DE RENDERIZADO DOM
// ==========================================
function renderPerfil(perfil) {
  if (!perfil) return;
  nombreUsuario.textContent = perfil.nombre_usuario;
  emailUsuario.textContent = perfil.email;
  nuevoPresupuesto.value = perfil.presupuesto_maximo_mensual || "";
  if (perfil.foto_perfil) {
    fotoPerfil.src = `${URL_BASE}/${perfil.foto_perfil}`;
    fotoDropdown.src = `${URL_BASE}/${perfil.foto_perfil}`;
  }
}

// ==========================================
// 6. EVENT LISTENERS (INTERACCIONES)
// ==========================================

// --- ACTUALIZAR FOTO DE PERFIL ---
inputFoto.addEventListener("change", async (e) => {
  const foto = e.target.files[0];
  if (!foto) return;
  const data = await cambiarFoto(foto);
  if (data) {
    fotoPerfil.src = `${URL_BASE}/${data.url}`;
    notificar("Foto actualizada correctamente", "success");
  } else {
    notificar("Error al cambiar la foto", "error");
  }
});

// --- GUARDAR NUEVO NICKNAME ---
btnGuardarNickname.addEventListener("click", async () => {
  const nick = nuevoNickname.value.trim();
  if (!nick) return;
  const cambiado = await cambiarNickname(nick);
  if (cambiado) {
    nombreUsuario.textContent = nick;
    nuevoNickname.value = "";
    notificar("Nickname actualizado correctamente", "success");
  } else {
    notificar("Error al cambiar el nickname", "error");
  }
});

// --- ACTUALIZAR CONTRASEÑA ---
btnGuardarPassword.addEventListener("click", async () => {
  const actual = passwordActual.value.trim();
  const nueva = passwordNueva.value.trim();
  const confirmar = passwordConfirmar.value.trim();

  if (!actual || !nueva || !confirmar) {
    notificar("Por favor completa todos los campos", "error");
    return;
  }
  if (nueva !== confirmar) {
    notificar("Las contraseñas no coinciden", "error");
    return;
  }
  const cambiada = await cambiarPassword(actual, nueva, confirmar);
  if (cambiada) {
    passwordActual.value = "";
    passwordNueva.value = "";
    passwordConfirmar.value = "";
    notificar("Contraseña actualizada correctamente", "success");
  } else {
    notificar("Error al cambiar la contraseña", "error");
  }
});

// --- MOSTRAR / OCULTAR CONTRASEÑAS ---
btnMostrar.addEventListener("click", function () {
  if (this.checked) {
    passwordActual.type = "text";
    passwordNueva.type = "text";
    passwordConfirmar.type = "text";
  } else {
    passwordActual.type = "password";
    passwordNueva.type = "password";
    passwordConfirmar.type = "password";
  }
});

// --- GUARDAR PRESUPUESTO ---
btnGuardarPresupuesto.addEventListener("click", async () => {
  const presupuesto = nuevoPresupuesto.value.trim();
  if (!presupuesto) return;
  const ok = await cambiarPresupuesto(presupuesto);
  if (ok) {
    notificar("Presupuesto updated correctamente", "success");
  } else {
    notificar("Error al cambiar el presupuesto", "error");
  }
});

// --- CONFIRMACIÓN DE ELIMINAR CUENTA ---
btnConfirmarEliminarCuenta.addEventListener("click", async () => {
  btnConfirmarEliminarCuenta.disabled = true;
  const eliminada = await eliminarCuenta();
  if (eliminada) {
    notificar(
      "Cuenta eliminada correctamente, Esperamos volver a verte por aqui, puedes registrarte nuevamente cuando quieras",
      "success",
    );
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("token");
    setTimeout(() => {
      window.location.replace("index.html");
    }, 3000);
  } else {
    btnConfirmarEliminarCuenta.disabled = false;
    notificar("Error al eliminar la cuenta", "error");
  }
});
