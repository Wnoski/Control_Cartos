// ==========================================
// 1. CONSTANTES Y ESTADO DE LA APLICACIÓN
// ==========================================
let token;
let graficaInstancia = null;

// ==========================================
// 2. REFERENCIAS AL DOM
// ==========================================
// Contenedores y Tarjetas Principales
const cardCategorias = document.getElementById("cardCategorias");
const contenedorGrafica = document.getElementById("contenedorGrafica");
const mensajeGrafica = document.getElementById("mensajeGrafica");
const welcoName = document.getElementById("welcoName");

// Elementos de la Gráfica
const grafica = document.getElementById("grafica").getContext("2d");
const divBtnsGrafica = document.getElementById("divBtnsGrafica");
const btnMesActual = document.getElementById("btnMesActual");
const btnMesAnterior = document.getElementById("btnMesAnterior");
const btnHistorico = document.getElementById("btnHistorico");

// Elementos de Control y Bloques de Botones
const divBotones = document.getElementById("divBtnsAccion");
const btnProcesarOCR = document.getElementById("btnProcesarOCR");

// Formularios
const formAgregarGasto = document.getElementById("formAgregarGasto");
const formAgregarGastoOCR = document.getElementById("formAgregarGastoOCR");
const formAgregarCategoria = document.getElementById("formAgregarCategoria");

// Inputs específicos de OCR
const ocrArchivo = document.getElementById("ocrArchivo");
const ocrMonto = document.getElementById("ocrMonto");

// Tarjetas de Presupuesto Global
const presupuestoMax = document.getElementById("presupuestoMax");
const totalGastado = document.getElementById("totalGastado");
const presupuestoRestante = document.getElementById("presupuestoRestante");
const barraGlobal = document.getElementById("barraGlobal");
const mensajeGlobal = document.getElementById("mensajeGlobal");

// Instancias de Modales (Bootstrap)
const modalAgregarCategoria = bootstrap.Modal.getOrCreateInstance(
  document.getElementById("modalAgregarCategoria"),
);

// ==========================================
// 3. INICIALIZACIÓN DE LA APP
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
  token = await comprobarToken();
  if (!token) return;
  await obtenerDatosPerfil(token);
  await obtenerDatosDashboard(token);
});

// ==========================================
// 4. SERVICIOS Y PETICIONES API
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
  if (!categorias || categorias.length === 0) {
    return false;
  }
  const select = document.getElementById(selectId);

  select.innerHTML = `<option value="" selected>Elige una categoría</option>
    ${categorias.map((c) => `<option value="${c.nombre}">${c.nombre}</option>`).join("")}`;

  return true;
}

// ==========================================
// 5. FUNCIONES DE RENDERIZADO Y HELPERS
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
            ? "🟡 Precavido"
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
            <p class="text-muted">Aún sin categorías. ¡Anímate a agregarlas para poder agregar gastos y tener más control de tus finanzas!</p>
            <button class="btn btn-primary btn-sm" onclick="abrirModalCategoria()">
              <i class="bi bi-plus-circle me-1"></i>Agregar categoría
            </button>
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
                ? "🟡 Precavido"
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
        <span>${categoria.nombre}</span>
        <span>${categoria.total_gastado || 0}€ / ${categoria.monto_maximo}€</span>
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
    mensajeGrafica.classList.remove("d-none");
    contenedorGrafica.classList.add("d-none");
    divBtnsGrafica.classList.add("d-none");
    graficaInstancia?.destroy();
    graficaInstancia = null;
    return;
  }

  if (graficaInstancia) graficaInstancia.destroy();

  mensajeGrafica.classList.add("d-none");
  contenedorGrafica.classList.remove("d-none");
  divBtnsGrafica.classList.remove("d-none");

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
    labels = datos.map((d) => d.nombre);
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
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          title: {
            display: true,
            text: "Euros (€)",
            align: "end",
            color: "#6c757d",
            font: {
              size: 12,
              weight: "bold",
            },
          },
        },
        x: {
          title: {
            display: true,
            text: `${temporalidad === "historico" ? "Tiempo" : "Categorias"}`,
            align: "end",
            color: "#6c757d",
            font: {
              size: 12,
              weight: "bold",
            },
          },
        },
      },
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

function abrirModalCategoria() {
  modalAgregarCategoria.show();
}

// ==========================================
// 6. EVENT LISTENERS (INTERACCIONES)
// ==========================================

// --- FILTROS DE TEMPORALIDAD DE LA GRÁFICA ---
divBtnsGrafica.addEventListener("click", async (e) => {
  const btnActivo = e.target.closest("button");
  if (!btnActivo) return;

  divBtnsGrafica.querySelector(".btn.active")?.classList.remove("active");
  btnActivo.classList.add("active");

  if (btnActivo.id === "btnMesActual") {
    await obtenerDatosDashboard(token);
  } else if (btnActivo.id === "btnMesAnterior") {
    await obtenerGraficaAnterior(token);
  } else {
    await obtenerGraficaHistorico(token);
  }
});

// --- PANEL DE ACCIONES PRINCIPALES (SWITCH) ---
divBotones.addEventListener("click", async (e) => {
  const btn = e.target.closest(".btn-acciones");
  if (!btn) return;

  switch (btn.dataset.title) {
    case "agregarGasto":
      const cargadas = await cargarCategoriasEnSelect("selectCategorias");
      if (cargadas) {
        bootstrap.Modal.getOrCreateInstance(
          document.getElementById("modalAgregarGasto"),
        ).show();
        break;
      }
      notificar(
        "Recuerda que para agregar un gasto, primero debes tener al menos una categoría creada.",
        "info",
      );
      break;
    case "agregarGastoOCR":
      const cargadasOCR = await cargarCategoriasEnSelect("ocrCategoria");
      if (cargadasOCR) {
        bootstrap.Modal.getOrCreateInstance(
          document.getElementById("modalAgregarGastoOCR"),
        ).show();
        break;
      }
      notificar(
        "Recuerda que para agregar un gasto, primero debes tener al menos una categoría creada.",
        "info",
      );
      break;
    case "categorias":
      window.location.href = "categorias.html";
      break;
    case "tablaGastos":
      window.location.href = "gastos.html";
      break;
    default:
      break;
  }
});

// --- ENVÍO DE FORMULARIOS (SUBMIT) ---
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

formAgregarCategoria.addEventListener("submit", async (e) => {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(e.target));
  const agregada = await agregarCategoria(datos);
  if (agregada) {
    modalAgregarCategoria.hide();
    e.target.reset();
    const categorias = await obtenerCategorias();
    renderCategorias(categorias);
  }
});

formAgregarGastoOCR.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formObj = Object.fromEntries(new FormData(formAgregarGastoOCR));

  bootstrap.Modal.getOrCreateInstance(
    document.getElementById("modalAgregarGastoOCR"),
  ).hide();

  const agregado = await agregarGasto(formObj);
  if (agregado) {
    formAgregarGastoOCR.reset();
    await obtenerDatosDashboard(token);
    notificar("Gasto agregado correctamente", "success");
  } else {
    notificar("Error al agregar gasto", "error");
  }
});

// --- ESCANEO DE DOCUMENTOS POR OCR ---
btnProcesarOCR.addEventListener("click", async () => {
  const archivo = ocrArchivo.files[0];

  if (!archivo) {
    notificar("Selecciona un archivo primero", "warning");
    return;
  }

  const formData = new FormData();
  formData.append("archivo", archivo);

  try {
    const res = await fetch(`${URL_BASE}/gastos/procesar-ocr`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();

    if (res.ok) {
      if (data.data) {
        ocrMonto.value = data.data;
        notificar("Monto extraído correctamente", "success");
      } else {
        notificar(
          "No se pudo procesar el archivo, introduzca los datos manualmente por favor",
          "warning",
        );
      }
    } else if (res.status === 400) {
      notificar(data.detail, "warning");
    }
  } catch (error) {
    console.error("Error al procesar OCR:", error);
    notificar("Error al procesar el archivo", "error");
  }
});
