// ==========================================
// 1. REFERENCIAS AL DOM
// ==========================================
const cardCategorias = document.getElementById("cardCategorias");
const grafica = document.getElementById("grafica").getContext("2d");
const divBtnGrafica = document.getElementById("divBtnsGrafica");
const divBotones = document.getElementById("divBtnsAccion");
const formAgregarGasto = document.getElementById("formAgregarGasto");

// Referencias tarjetas presupuesto
const presupuestoMax = document.getElementById("presupuestoMax");
const totalGastado = document.getElementById("totalGastado");
const presupuestoRestante = document.getElementById("presupuestoRestante");
const barraGlobal = document.getElementById("barraGlobal");
const mensajeGlobal = document.getElementById("mensajeGlobal");
const welcoName = document.getElementById("welcoName");

let token;
let graficaInstancia = null;

// ==========================================
// 2. INICIALIZACIÓN
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
  token = await comprobarToken();
  if (!token) return;
  await obtenerDatosPerfil(token);
  await obtenerDatosDashboard(token);
});

// ==========================================
// 3. EVENT LISTENERS
// ==========================================
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
      await cargarCategoriasEnSelect("ocrCategoria");
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
  const formObj = Object.fromEntries(new FormData(formAgregarGasto));
  bootstrap.Modal.getOrCreateInstance(
    document.getElementById("modalAgregarGasto"),
  ).hide();
  const agregado = await agregarGasto(formObj);
  if (agregado) {
    formAgregarGasto.reset();
    await obtenerDatosDashboard(token);
    notificar("Gasto agregado correctamente", "success");
  } else {
    notificar("Error al agregar gasto", "error");
  }
});

ulFoto.addEventListener("click", (e) => {
  const btnCerrar = e.target.closest(".log-out");
  if (!btnCerrar) return;
  localStorage.clear();
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
});

// ==========================================
// 4. PETICIONES API
// ==========================================
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
    return res.ok;
  } catch (error) {
    console.error("Error al agregar gasto:", error);
    return false;
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
      const datos = procesarHistorico(obj_res.data);
      renderGrafica(datos, "historico");
    }
  } catch (error) {
    console.error("Error al obtener histórico:", error);
  }
}

async function obtenerCategorias() {
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
  const categorias = await obtenerCategorias();
  const select = document.getElementById(selectId);
  if (!categorias || categorias.length === 0) {
    select.innerHTML = `<option value="">Sin categorías</option>`;
    return;
  }
  select.innerHTML = `<option value="" selected>Elige una categoría</option>
    ${categorias.map((c) => `<option value="${c.nombre}">${c.nombre}</option>`).join("")}`;
}

// ==========================================
// 5. RENDERIZADO
// ==========================================
function renderPresupuesto(datos) {
  const mensaje =
    datos.porcentaje_global > 100
      ? "🔴 Límite superado"
      : datos.porcentaje_global === 100
        ? "🔴 Has llegado al límite"
        : datos.porcentaje_global >= 75
          ? "🟡 Cerca del límite"
          : datos.porcentaje_global >= 60
            ? "🟡 Gastos "
            : datos.porcentaje_global >= 40
              ? "🟢 Estable"
              : datos.porcentaje_global > 0
                ? "🟢 Todo bajo control"
                : "Sin gastos aún";

  const colorBarra =
    datos.porcentaje_global >= 100
      ? "bg-danger"
      : datos.porcentaje_global >= 60
        ? "bg-warning"
        : "bg-success";

  const restante = (
    datos.presupuesto_maximo - datos.total_gastado_global
  ).toFixed(2);

  presupuestoMax.textContent = `${datos.presupuesto_maximo} €`;
  totalGastado.textContent = `${datos.total_gastado_global} €`;

  if (restante > 0) {
    presupuestoRestante.classList.remove("text-danger");
    presupuestoRestante.textContent = `${restante} €`;
  } else {
    presupuestoRestante.classList.add("text-danger");
    presupuestoRestante.textContent = `${restante} €`;
  }
  barraGlobal.className = `progress-bar ${colorBarra}`;
  barraGlobal.style.width = `${Math.min(datos.porcentaje_global, 100)}%`;
  mensajeGlobal.textContent = mensaje;
}

function renderCategorias(categorias) {
  if (!categorias || categorias.length === 0) {
    cardCategorias.innerHTML = `<div class="text-center py-5 text-muted">
          <i class="bi bi-tags fs-1 d-block mb-2"></i>
            <p class="text-muted">Aún sin categorías. ¡Anímate a agregarlas para tener más control de tus finanzas!</p>
      </div>`;

    return;
  }
  cardCategorias.innerHTML = categorias
    .map((categoria) => {
      const mensaje =
        categoria.porcentaje > 100
          ? "🔴 Límite superado"
          : categoria.porcentaje === 100
            ? "🔴 Has llegado al límite"
            : categoria.porcentaje >= 75
              ? "🟡 Cerca del límite"
              : categoria.porcentaje >= 60
                ? "🟡 Buen ritmo, pero ojo con los cartos"
                : categoria.porcentaje >= 40
                  ? "🟢 Estable"
                  : categoria.porcentaje > 0
                    ? "🟢 Todo bajo control"
                    : "Sin gastos aún";

      const colorBarra =
        categoria.porcentaje >= 100
          ? "bg-danger"
          : categoria.porcentaje >= 60
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
      <small class="text-muted">${mensaje}</small>
    </div>`;
    })
    .join("");
}

function renderGrafica(datos, temporalidad) {
  if (!datos || datos.length === 0) {
    grafica.innerHTML = `<p class="text-muted text-center mt-3">Aún sin datos para mostrar en la gráfica.</p>`;
    return;
  }
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
    labels = datos.map((h) => `${h.mes}/${h.año}`);
    gastos = datos.map((h) => h.total);
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
      labels,
      datasets: [
        { label: "Gastado €", data: gastos, backgroundColor: colores },
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
