// ==========================================
// 1. CONSTANTES Y REFERENCIAS AL DOM
// ==========================================
const URL_BASE = "http://127.0.0.1:8000";
let token;
let gastoIdSeleccionado = null;
let dataTable = null;

const bodyTablaGastos = document.getElementById("bodyTablaGastos");
const formAgregarGasto = document.getElementById("formAgregarGasto");
const formEditarGasto = document.getElementById("formEditarGasto");
const btnAbrirAgregarGasto = document.getElementById("btnAbrirAgregarGasto");
const btnAbrirAgregarGastoOCR = document.getElementById(
  "btnAbrirAgregarGastoOCR",
);
const btnConfirmarEliminarGasto = document.getElementById(
  "btnConfirmarEliminarGasto",
);
const editGastoMonto = document.getElementById("editGastoMonto");
const editGastoCategoria = document.getElementById("editGastoCategoria");
const editGastoDescripcion = document.getElementById("editGastoDescripcion");
const gastoCategoria = document.getElementById("gastoCategoria");

const modalAgregarGasto = bootstrap.Modal.getOrCreateInstance(
  document.getElementById("modalAgregarGasto"),
);
const modalEditarGasto = bootstrap.Modal.getOrCreateInstance(
  document.getElementById("modalEditarGasto"),
);
const modalEliminarGasto = bootstrap.Modal.getOrCreateInstance(
  document.getElementById("modalEliminarGasto"),
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
  if (!token) {
    window.location.href = "index.html";
    return;
  }
  const [gastos, categorias] = await Promise.all([
    obtenerGastos(),
    obtenerCategorias(),
  ]);
  cargarCategoriasEnSelect(gastoCategoria, categorias);
  renderGastos(gastos);
}

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
    console.warn("Error al obtener gastos:", error);
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
    console.warn("Error al obtener categorias:", error);
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
    console.warn("Error al agregar gasto:", error);
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

async function editarGasto(id, datos) {
  console.log(datos);
  try {
    const res = await fetch(`${URL_BASE}/gastos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(
        datos.nombre_categoria,
        datos.monto,
        datos.descripcion,
      ),
    });
    return res.ok;
  } catch (error) {
    console.warn("Error al editar gasto:", error);
    return false;
  }
}

// ==========================================
// 4. RENDERIZADO
// ==========================================
function cargarCategoriasEnSelect(select, categorias) {
  if (!categorias || categorias.length === 0) {
    select.innerHTML = `<option value="">Sin categorías</option>`;
    return;
  }
  select.innerHTML = `<option value="" selected>Elige una categoría</option>
    ${categorias.map((c) => `<option value="${c.nombre}">${c.nombre}</option>`).join("")}`;
}

function renderGastos(gastos) {
  if (dataTable) {
    dataTable.destroy();
    dataTable = null;
  }

  if (!gastos || gastos.length === 0) {
    bodyTablaGastos.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-5 text-muted">
          <i class="bi bi-receipt fs-1 d-block mb-2"></i>
          Aún sin gastos registrados.
        </td>
      </tr>`;
    return;
  }

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
// 5. EVENT LISTENERS
// ==========================================
btnAbrirAgregarGasto.addEventListener("click", async () => {
  const categorias = await obtenerCategorias();
  cargarCategoriasEnSelect(gastoCategoria, categorias);
  modalAgregarGasto.show();
});

btnAbrirAgregarGastoOCR.addEventListener("click", () => {
  alert("OCR próximamente");
});

formAgregarGasto.addEventListener("submit", async (e) => {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(e.target));
  const ok = await agregarGasto(datos);
  if (ok) {
    modalAgregarGasto.hide();
    e.target.reset();
    const gastos = await obtenerGastos();
    renderGastos(gastos);
  }
});

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

formEditarGasto.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const datos = Object.fromEntries(
    [...formData.entries()].filter(([_, v]) => v !== ""),
  );

  if (Object.keys(datos).length === 0) {
    alert("No has modificado ningún campo");
    return;
  }

  const ok = await editarGasto(gastoIdSeleccionado, datos);
  if (ok) {
    modalEditarGasto.hide();
    const gastos = await obtenerGastos();
    renderGastos(gastos);
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
  const ok = await eliminarGasto(gastoIdSeleccionado);
  if (ok) {
    modalEliminarGasto.hide();
    const gastos = await obtenerGastos();
    renderGastos(gastos);
  }
});
