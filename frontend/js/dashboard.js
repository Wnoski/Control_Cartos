// ==========================================
// 1. SELECCIÓN DE ELEMENTOS DEL DOM
// ==========================================
const URL_BASE = "http://127.0.0.1:8000";
const cardPresupuesto = document.getElementById("cardPresupuesto");
const cardCategorias = document.getElementById("cardCategorias");
const grafica = document.getElementById("grafica").getContext("2d");
const divBtnGrafica = document.getElementById("divBtnsGrafica");
const divBotones = document.getElementById("divBtnsAccion");
const formAgregarGasto = document.getElementById("formAgregarGasto");
const btnGuardarGasto = document.getElementById("btnGuardarGasto");
let token;
// ==========================================
// 2. INICIALIZACIÓN / EVENT LISTENERS
// ==========================================
document.addEventListener("DOMContentLoaded", comprobarToken);

divBtnGrafica.addEventListener("click", async (e) => {
  if (e.target.tagName !== "BUTTON") return;

  e.target.id === "btnMesActual"
    ? await obtenerDatosDashboard(token)
    : e.target.id === "btnMesAnterior"
      ? await obtenerGraficaAnterior(token)
      : await obtenerGraficaHistorico(token);
});

divBotones.addEventListener("click", async (e) => {
  const btn = e.target.closest(".btn-acciones");
  if (!btn) return;

  switch (btn.dataset.title) {
    case "agregarGasto":
      await cargarCategoriasEnSelect("selectCategorias");
      bootstrap.Modal.getOrCreateInstance(
        document.getElementById("modalAgregarGasto"),
      ).show();
      break;
    case "agregarGastoOCR":
      await cargarCategoriasEnSelect("ocrCategorias");
      bootstrap.Modal.getOrCreateInstance(
        document.getElementById("modalAgregarGastoOCR"),
      ).show();
      break;
    case "categorias":
      window.location.href = "categorias.html";
      break;
    case "tablaGastos":
      window.location.href = "gastos.html";
      break;
  }
});

formAgregarGasto.addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = new FormData(formAgregarGasto);
  const formObj = Object.fromEntries(form);
  console.log(formObj);
  bootstrap.Modal.getOrCreateInstance(
    document.getElementById("modalAgregarGasto"),
  ).hide();

  const agregado = await agregarGasto(formObj);

  if (agregado) {
    formAgregarGasto.reset();
    await obtenerDatosDashboard(token);
    alert("Gasto agregado");
  } else {
    alert("gasto no agregado");
  }
});

async function agregarGasto(form) {
  try {
    const res = await fetch(`${URL_BASE}/gastos/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      console.log(res.json());
      return true;
    }
    return false;
  } catch (error) {
    console.warn("Error el intentar agregar un gasto: ", error);
    return false;
  }
}

// ==========================================
// 3. LÓGICA CENTRAL Y PETICIONES API
// ==========================================
async function comprobarToken() {
  const cookieToken = obtenerCookie("token");
  const localToken = localStorage.getItem("token");
  const tokenAUsar = cookieToken || localToken;

  if (!tokenAUsar) {
    window.location.href = "index.html";
    return;
  }

  const valido = await verificarTiempoToken(tokenAUsar);
  if (!valido) {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("token");
    window.location.href = "index.html";
    return;
  }

  localStorage.setItem("token", tokenAUsar);
  token = tokenAUsar;

  await obtenerPerfil(token);
  await obtenerDatosDashboard(token);
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
    console.warn("Error de red:", error);
    return false;
  }
}

async function obtenerPerfil(token) {
  try {
    const res = await fetch(`${URL_BASE}/perfil/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const obj_res = await res.json();
      return obj_res.data;
    }
  } catch (error) {
    console.error("Error al obtener perfil:", error);
  }
}

async function obtenerDatosDashboard(token) {
  try {
    const res = await fetch(`${URL_BASE}/dashboard/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const obj_res = await res.json();
      renderPresupuesto(obj_res.data);
      renderCategorias(obj_res.data.categorias);
      renderGrafica(obj_res.data.categorias);
      return obj_res;
    }
  } catch (error) {
    console.error("Error al obtener dashboard:", error);
  }
}

async function obtenerGraficaAnterior(token) {
  try {
    const res = await fetch(`${URL_BASE}/dashboard/mes-anterior`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const obj_res = await res.json();
      renderGrafica(obj_res.data.categorias);
    }
  } catch (error) {
    console.error("Error al obtener mes anterior:", error);
  }
}

async function obtenerGraficaHistorico(token) {
  try {
    const res = await fetch(`${URL_BASE}/dashboard/historico`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const obj_res = await res.json();
      renderGrafica(obj_res.data, "historico");
    }
  } catch (error) {
    console.error("Error al obtener histórico:", error);
  }
}

async function obtenerCategorias(token) {
  try {
    const res = await fetch(`${URL_BASE}/categorias/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const obj_res = await res.json();
      return obj_res.data;
    }
    return null;
  } catch (error) {
    console.error("Error al obtener categorias:", error);
    return null;
  }
}

async function cargarCategoriasEnSelect(selectId) {
  const categorias = await obtenerCategorias(token);
  const select = document.getElementById(selectId);

  if (!categorias || categorias.length === 0) {
    select.innerHTML = `<option value="">Sin categorías</option>`;
    return;
  }

  select.innerHTML = `<option value="" selected>Elige una categoría</option>
    ${categorias.map((c) => `<option value="${c.nombre}">${c.nombre}</option>`).join("")}`;
}

// ==========================================
// 4. FUNCIONES DE RENDERIZADO
// ==========================================
function renderPresupuesto(datos) {
  const mensaje =
    datos.porcentaje_global >= 100
      ? "🔴 Límite superado"
      : datos.porcentaje_global >= 75
        ? "🟡 Cerca del límite"
        : "🟢 Vas bien";

  const colorBarra =
    datos.porcentaje_global >= 100
      ? "bg-danger"
      : datos.porcentaje_global >= 75
        ? "bg-warning"
        : "bg-success";

  cardPresupuesto.innerHTML = `
    <h5 class="card-title text-secondary">Presupuesto mensual</h5>
    <h2>${datos.total_gastado_global} €</h2>
    <p class="text-secondary mb-1">de <span>${datos.presupuesto_maximo} €</span></p>
    <div class="progress mb-2" style="height:8px;">
      <div class="progress-bar ${colorBarra}" style="width:${Math.min(datos.porcentaje_global, 100)}%"></div>
    </div>
    <p class="mb-0">${mensaje}</p>`;
}

function renderCategorias(categorias) {
  if (!categorias || categorias.length === 0) {
    cardCategorias.innerHTML = `
      <h5>Aún sin categorías</h5>
      <p>¡Anímate a agregarlas para tener más control de tus finanzas!</p>`;
    return;
  }

  cardCategorias.innerHTML = categorias
    .map((categoria) => {
      const mensaje =
        categoria.porcentaje >= 100
          ? "🔴 Límite superado"
          : categoria.porcentaje >= 75
            ? "🟡 Cerca del límite"
            : "🟢 Vas bien";

      const colorBarra =
        categoria.porcentaje >= 100
          ? "bg-danger"
          : categoria.porcentaje >= 75
            ? "bg-warning"
            : "bg-success";

      return `<div class="mb-3">
      <div class="d-flex justify-content-between mb-1">
        <span>${categoria.categoria}</span>
        <span>${categoria.total_gastado}€ / ${categoria.monto_maximo}€</span>
      </div>
      <div class="progress" style="height:7px;">
        <div class="progress-bar ${colorBarra}" style="width:${Math.min(categoria.porcentaje, 100)}%"></div>
      </div>
      <small class="text-secondary">${mensaje}</small>
    </div>`;
    })
    .join("");
}

let graficaInstancia = null;

function renderGrafica(datos, temporalidad) {
  if (graficaInstancia) graficaInstancia.destroy();

  const paleta = [
    "#2ecc71",
    "#f5a623",
    "#e74c3c",
    "#4a9eed",
    "#9b59b6",
    "#e67e22",
  ];

  let labels, gastos, colores, tipo;

  if (temporalidad === "historico") {
    const historico = procesarHistorico(datos);
    labels = historico.map((h) => `${h.mes}/${h.año}`);
    gastos = historico.map((h) => h.total);
    colores = "#e74c3c";
    tipo = "line";
  } else {
    labels = datos.map((d) => d.categoria);
    gastos = datos.map((d) => d.total_gastado);
    colores = datos.map((_, i) => paleta[i % paleta.length]);
    tipo = "bar";
  }

  graficaInstancia = new Chart(grafica, {
    type: tipo,
    data: {
      labels: labels,
      datasets: [
        {
          label: "Gastado €",
          data: gastos,
          backgroundColor: colores,
        },
      ],
    },
  });
}

function procesarHistorico(datos) {
  const meses = {};
  datos.forEach((item) => {
    const key = `${item.año}-${item.mes}`;
    if (!meses[key]) meses[key] = { mes: item.mes, año: item.año, total: 0 };
    meses[key].total += item.total_gastado;
  });
  return Object.values(meses);
}

//Cerrar Sesion

const ulFoto = document.getElementById("ul-foto");

ulFoto.addEventListener("click", (e) => {
  const btnCerrar = e.target.closest(".log-out");
  if (!btnCerrar) return;

  localStorage.clear();
  document.cookie = "token =; expires = Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
});
