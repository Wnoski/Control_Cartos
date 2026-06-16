// ==========================================
// 1. CONSTANTES Y ESTADO DE LA APLICACIÓN
// ==========================================
let token;
let gastoIdSeleccionado = null;
let dataTable = null;

// ==========================================
// 2. REFERENCIAS AL DOM
// ==========================================
// Tablas y Contenedores
const bodyTablaGastos = document.getElementById("bodyTablaGastos");

// Formularios
const formAgregarGasto = document.getElementById("formAgregarGasto");
const formEditarGasto = document.getElementById("formEditarGasto");
const formAgregarGastoOCR = document.getElementById("formAgregarGastoOCR");

// Botones de Apertura y Acción
const btnAbrirAgregarGasto = document.getElementById("btnAbrirAgregarGasto");
const btnAbrirAgregarGastoOCR = document.getElementById(
  "btnAbrirAgregarGastoOCR",
);
const btnConfirmarEliminarGasto = document.getElementById(
  "btnConfirmarEliminarGasto",
);
const btnProcesarOCR = document.getElementById("btnProcesarOCR");

// Inputs y Selects de Formulario
const ocrArchivo = document.getElementById("ocrArchivo");
const ocrMonto = document.getElementById("ocrMonto");
const editGastoMonto = document.getElementById("editGastoMonto");
const editGastoCategoria = document.getElementById("editGastoCategoria");
const editGastoDescripcion = document.getElementById("editGastoDescripcion");
const selectCategoria = document.getElementById("selectGastoCategoria");
const selectCategoriaOCR = document.getElementById("selectCategoriaOCR");

// Instancias de Modales (Bootstrap)
const modalAgregarGasto = bootstrap.Modal.getOrCreateInstance(
  document.getElementById("modalAgregarGasto"),
);
const modalAgregarGastoOCR = bootstrap.Modal.getOrCreateInstance(
  document.getElementById("modalAgregarGastoOCR"),
);
const modalEditarGasto = bootstrap.Modal.getOrCreateInstance(
  document.getElementById("modalEditarGasto"),
);
const modalEliminarGasto = bootstrap.Modal.getOrCreateInstance(
  document.getElementById("modalEliminarGasto"),
);

// ==========================================
// 3. INICIALIZACIÓN DE LA APP
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
  token = await comprobarToken();

  const [gastos, categorias, perfil] = await Promise.all([
    obtenerGastos(),
    obtenerCategorias(),
    obtenerDatosPerfil(token),
  ]);

  cargarCategoriasEnSelect(selectCategoria, categorias);
  renderPerfil(perfil);
  renderGastos(gastos);
});

// ==========================================
// 4. SERVICIOS Y PETICIONES API
// ==========================================
async function obtenerGastos() {
  try {
    const res = await fetch(`${URL_BASE}/gastos/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
    return null;
  } catch (error) {
    console.error("Error al obtener gastos:", error);
    return null;
  }
}

async function obtenerCategorias() {
  try {
    const res = await fetch(`${URL_BASE}/categorias/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
    return null;
  } catch (error) {
    console.error("Error al obtener categorias:", error);
    return null;
  }
}

async function agregarGasto(datos) {
  try {
    const res = await fetch(`${URL_BASE}/gastos/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datos),
    });
    return res.ok;
  } catch (error) {
    console.error("Error al agregar gasto:", error);
    return false;
  }
}

async function editarGasto(id, datos) {
  try {
    const res = await fetch(`${URL_BASE}/gastos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datos),
    });
    if (res.ok) {
      return true;
    }
    notificar("Error al editar gasto", "error");
    return false;
  } catch (error) {
    console.error("Error al editar gasto:", error);
    return false;
  }
}

async function eliminarGasto(id) {
  try {
    const res = await fetch(`${URL_BASE}/gastos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch (error) {
    console.warn("Error al eliminar gasto:", error);
    return false;
  }
}

// ==========================================
// 5. FUNCIONES DE RENDERIZADO DOM
// ==========================================
function cargarCategoriasEnSelect(select, categorias) {
  select.innerHTML = `<option value="" selected>Elige una categoría</option>
    ${categorias.map((c) => `<option value="${c.nombre}">${c.nombre}</option>`).join("")}`;
}

function renderGastos(gastos) {
  if (dataTable) {
    dataTable.destroy();
    dataTable = null;
  }

  const thead = document.querySelector("thead");

  if (!gastos || gastos.length === 0) {
    thead.classList.add("d-none");
    bodyTablaGastos.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-5 text-muted">
          <i class="bi bi-receipt fs-1 d-block mb-2"></i>
          Aún sin gastos registrados.
        </td>
      </tr>`;
    return;
  }

  thead.classList.remove("d-none");
  bodyTablaGastos.innerHTML = gastos
    .map(
      (g) => `
    <tr>
      <td>${new Date(g.fecha).toLocaleDateString("es-ES")}</td>
      <td>${g.descripcion || "-"}</td>
      <td>${g.nombre}</td>
      <td>${g.monto_gasto} €</td>
      <td class="text-center">
        <button class="btn btn-outline-warning btn-sm me-1 btn-editar-gasto"
          data-id="${g.id}"
          data-monto="${g.monto_gasto}"
          data-descripcion="${g.descripcion || ""}"
          data-categoria="${g.nombre}">
          <i class="bi bi-pencil"></i>
        </button> 
        <button class="btn btn-outline-danger btn-sm btn-eliminar-gasto" data-id="${g.id}">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>`,
    )
    .join("");

  dataTable = new DataTable("#tablaGastos", {
    language: {
      search: "Buscar:",
      lengthMenu: "Mostrar _MENU_ registros",
      info: "Mostrando _START_ a _END_ de _TOTAL_ gastos",
      infoEmpty: "No hay gastos registrados",
      infoFiltered: "(filtrado de _MAX_ gastos en total)",
      zeroRecords: "No se encontraron gastos con ese criterio",
      emptyTable: "No hay gastos registrados",
      paginate: { next: "Siguiente", previous: "Anterior" },
    },
    columnDefs: [{ orderable: false, targets: -1 }],
  });
}

// ==========================================
// 6. EVENT LISTENERS (INTERACCIONES)
// ==========================================

// --- CONTROL DE APERTURA DE MODALES ---
btnAbrirAgregarGasto.addEventListener("click", async () => {
  const categorias = await obtenerCategorias();
  if (!categorias || categorias.length !== 0) {
    cargarCategoriasEnSelect(selectCategoria, categorias);
    modalAgregarGasto.show();
    return;
  }
  notificar(
    "Recuerda que para agregar un gasto, primero debes tener al menos una categoría creada.",
    "info",
  );
});

btnAbrirAgregarGastoOCR.addEventListener("click", async () => {
  const categoriesOCR = await obtenerCategorias();
  if (!categoriesOCR || categoriesOCR.length !== 0) {
    cargarCategoriasEnSelect(selectCategoriaOCR, categoriesOCR);
    modalAgregarGastoOCR.show();
    return;
  }
  notificar(
    "Recuerda que para agregar un gasto, primero debes tener al menos una categoría creada.",
    "info",
  );
});

// --- FLUJO AGREGAR Y EDITAR GASTO MANUAL ---
formAgregarGasto.addEventListener("submit", async (e) => {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(e.target));
  const agregado = await agregarGasto(datos);
  if (agregado) {
    modalAgregarGasto.hide();
    e.target.reset();
    const gastos = await obtenerGastos();
    renderGastos(gastos);
  }
});

formEditarGasto.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const datos = Object.fromEntries(formData);

  const editado = await editarGasto(gastoIdSeleccionado, datos);
  if (editado) {
    notificar("Gasto actualizado correctamente", "success");
    modalEditarGasto.hide();
    const gastos = await obtenerGastos();
    renderGastos(gastos);
  }
});

// --- ACCIONES EN LA TABLA (EDITAR / ELIMINAR) ---
bodyTablaGastos.addEventListener("click", async (e) => {
  const btnEliminar = e.target.closest(".btn-eliminar-gasto");
  const btnEditar = e.target.closest(".btn-editar-gasto");

  if (btnEliminar) {
    gastoIdSeleccionado = btnEliminar.dataset.id;
    modalEliminarGasto.show();
  }

  if (btnEditar) {
    gastoIdSeleccionado = btnEditar.dataset.id;
    editGastoMonto.value = btnEditar.dataset.monto;
    editGastoDescripcion.value = btnEditar.dataset.descripcion || "";
    const categorias = await obtenerCategorias();
    cargarCategoriasEnSelect(editGastoCategoria, categorias);
    editGastoCategoria.value = btnEditar.dataset.categoria;
    modalEditarGasto.show();
  }
});

bodyTablaGastos.addEventListener("click", (e) => {
  const btnEliminar = e.target.closest(".btn-eliminar-gasto");
  if (btnEliminar) {
    gastoIdSeleccionado = btnEliminar.dataset.id;
    modalEliminarGasto.show();
  }
});

btnConfirmarEliminarGasto.addEventListener("click", async () => {
  const eliminado = await eliminarGasto(gastoIdSeleccionado);
  if (eliminado) {
    notificar("Gasto eliminado correctamente", "success");
    modalEliminarGasto.hide();
    const gastos = await obtenerGastos();
    renderGastos(gastos);
    return;
  }
  notificar("Error al intentar eliminar el gasto", "error");
});

// --- FLUJO ESCANEO Y GUARDADO POR OCR ---
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

formAgregarGastoOCR.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formObj = Object.fromEntries(new FormData(formAgregarGastoOCR));

  bootstrap.Modal.getOrCreateInstance(
    document.getElementById("modalAgregarGastoOCR"),
  ).hide();

  const agregado = await agregarGasto(formObj);
  if (agregado) {
    formAgregarGastoOCR.reset();
    const gastos = await obtenerGastos();
    renderGastos(gastos);
    notificar("Gasto agregado correctamente", "success");
  } else {
    notificar("Error al agregar gasto", "error");
  }
});
