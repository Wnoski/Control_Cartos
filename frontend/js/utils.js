const URL_BASE = "http://127.0.0.1:8000";
const fotoDropdown = document.getElementById("fotoDropdown");
const ulFoto = document.getElementById("ul-foto");

async function comprobarToken() {
  const cookieToken = obtenerCookie("token");
  const localToken = localStorage.getItem("token");
  const token = cookieToken || localToken;

  const rutaActual = window.location.pathname;
  const paginaActual =
    rutaActual.includes("iniciarSesion.html") ||
    rutaActual.includes("registrarse.html");

  if (!token) {
    if (paginaActual) {
      return;
    } else {
      window.location.href = "index.html";
      return;
    }
  }
  const valido = await verificarTiempoToken(token);

  if (valido) {
    localStorage.setItem("token", token);

    if (paginaActual) {
      window.location.href = "dashboard.html";
    }

    return token;
  } else {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("token");

    if (!paginaActual) {
      window.location.href = "index.html";
    }

    return;
  }
}

async function obtenerDatosPerfil(token) {
  try {
    const res = await fetch(`${URL_BASE}/perfil/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();

      renderPerfil(data.data);
    }
  } catch (error) {
    console.error("Error al obtener datos de perfil:", error);
  }
}

function renderPerfil(perfil) {
  if (!perfil) return;
  const fotoDropdown = document.getElementById("fotoDropdown");
  if (fotoDropdown && perfil.foto_perfil) {
    fotoDropdown.src = `${URL_BASE}/${perfil.foto_perfil}`;
  }

  if (window.location.pathname.includes("dashboard.html")) {
    if (welcoName && perfil.nombre_usuario) {
      welcoName.textContent = perfil.nombre_usuario;
    }
  }
}

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
  setTimeout(() => alerta.remove(), 5000);
}

function obtenerCookie(nombre) {
  const cookies = document.cookie.split(";");
  const cookie = cookies.find((c) => c.trim().startsWith(nombre));
  return cookie ? cookie.split("=")[1] : null;
}

async function verificarTiempoToken(token) {
  try {
    const res = await fetch(`${URL_BASE}/usuarios/tiempo-token`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const obj_res = await res.json();
      localStorage.removeItem("token");
      window.location.href = "index.html";
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error de red:", error);
    return false;
  }
}

async function agregarCategoria(datos) {
  try {
    const res = await fetch(`${URL_BASE}/categorias/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datos),
    });
    return res.ok;
  } catch (error) {
    console.error("Error al agregar categoria:", error);
    return false;
  }
}

//Cerrar Sesion

ulFoto.addEventListener("click", (e) => {
  const btnCerrar = e.target.closest(".log-out");
  if (!btnCerrar) return;
  localStorage.clear();
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
});
