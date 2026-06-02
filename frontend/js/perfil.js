// ==========================================
// 1. CONSTANTES Y REFERENCIAS AL DOM
// ==========================================
const URL_BASE = "http://127.0.0.1:8000";
let token;

const fotoPerfil = document.getElementById("fotoPerfil");
const fotoDropdown = document.getElementById("fotoDropdown");
const nombreUsuario = document.getElementById("nombreUsuario");
const emailUsuario = document.getElementById("emailUsuario");
const inputFoto = document.getElementById("inputFoto");
const nuevoNickname = document.getElementById("nuevoNickname");
const btnGuardarNickname = document.getElementById("btnGuardarNickname");
const passwordActual = document.getElementById("passwordActual");
const passwordNueva = document.getElementById("passwordNueva");
const passwordConfirmar = document.getElementById("passwordConfirmar");
const btnGuardarPassword = document.getElementById("btnGuardarPassword");
const nuevoPresupuesto = document.getElementById("nuevoPresupuesto");
const btnGuardarPresupuesto = document.getElementById("btnGuardarPresupuesto");
const btnConfirmarEliminarCuenta = document.getElementById(
  "btnConfirmarEliminarCuenta",
);

const modalEliminarCuenta = bootstrap.Modal.getOrCreateInstance(
  document.getElementById("modalEliminarCuenta"),
);

// ==========================================
// 2. INICIALIZACIÓN
// ==========================================
document.addEventListener("DOMContentLoaded", comprobarToken);

// ==========================================
// 3. LÓGICA CENTRAL Y PETICIONES API
// ==========================================
async function comprobarToken() {
  token = localStorage.getItem("token");
  const payload = JSON.parse(atob(token.split(".")[1]));
  const expirado = payload.exp * 1000 < Date.now();

  if (!token || expirado) {
    window.location.href = "index.html";
    return;
  }
  const perfil = await obtenerDatosPerfil();
  renderPerfil(perfil);
}

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
// 4. RENDERIZADO
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
// 5. EVENT LISTENERS
// ==========================================
btnGuardarNickname.addEventListener("click", async () => {
  const nick = nuevoNickname.value.trim();
  if (!nick) return;
  const ok = await cambiarNickname(nick);
  if (ok) {
    nombreUsuario.textContent = nick;
    nuevoNickname.value = "";
    alert("Nickname actualizado correctamente");
  } else {
    alert("Error al cambiar el nickname");
  }
});

btnGuardarPassword.addEventListener("click", async () => {
  const actual = passwordActual.value.trim();
  const nueva = passwordNueva.value.trim();
  const confirmar = passwordConfirmar.value.trim();

  if (!actual || !nueva || !confirmar) {
    alert("Por favor completa todos los campos");
    return;
  }
  if (nueva !== confirmar) {
    alert("Las contraseñas no coinciden");
    return;
  }
  const ok = await cambiarPassword(actual, nueva, confirmar);
  if (ok) {
    passwordActual.value = "";
    passwordNueva.value = "";
    passwordConfirmar.value = "";
    alert("Contraseña actualizada correctamente");
  } else {
    alert("Error al cambiar la contraseña");
  }
});

btnGuardarPresupuesto.addEventListener("click", async () => {
  const presupuesto = nuevoPresupuesto.value.trim();
  if (!presupuesto) return;
  const ok = await cambiarPresupuesto(presupuesto);
  if (ok) {
    alert("Presupuesto actualizado correctamente");
  } else {
    alert("Error al cambiar el presupuesto");
  }
});

inputFoto.addEventListener("change", async (e) => {
  const foto = e.target.files[0];
  if (!foto) return;
  const data = await cambiarFoto(foto);
  if (data) {
    fotoPerfil.src = `${URL_BASE}/${data.url}`;
    alert("Foto actualizada correctamente");
  } else {
    alert("Error al cambiar la foto");
  }
});

btnConfirmarEliminarCuenta.addEventListener("click", async () => {
  const ok = await eliminarCuenta();
  if (ok) {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  } else {
    alert("Error al eliminar la cuenta");
  }
});
