// ==========================================
// 1. CONSTANTES Y ESTADO DE LA APLICACIÓN
// ==========================================
let categoriaIdSeleccionada = null;
let dataTable = null;

// ==========================================
// 2. REFERENCIAS AL DOM
// ==========================================
// Tablas y Contenedores
const tablaCategorias = document.getElementById("tablaCategorias");

// Formularios
const formAgregarCategoria = document.getElementById("formAgregarCategoria");
const formEditarCategoria = document.getElementById("formEditarCategoria");

// Botones de Acción
const btnAbrirAgregarCategoria = document.getElementById(
  "btnAbrirAgregarCategoria",
);
const btnConfirmarEliminar = document.getElementById("btnConfirmarEliminar");

// Inputs de Formulario
const editCategoriaNombre = document.getElementById("editCategoriaNombre");
const editCategoriaMonto = document.getElementById("editCategoriaMonto");

// Instancias de Modales (Bootstrap)
const modalAgregarCategoria = bootstrap.Modal.getOrCreateInstance(
  document.getElementById("modalAgregarCategoria"),
);
const modalEditarCategoria = bootstrap.Modal.getOrCreateInstance(
  document.getElementById("modalEditarCategoria"),
);
const modalEliminarCategoria = bootstrap.Modal.getOrCreateInstance(
  document.getElementById("modalEliminarCategoria"),
);

// ==========================================
// 3. INICIALIZACIÓN DE LA APP
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
  token = await comprobarToken();

  const [categorias, perfil] = await Promise.all([
    obtenerCategorias(),
    obtenerDatosPerfil(token),
  ]);

  renderPerfil(perfil);
  renderCategorias(categorias);
});

// ==========================================
// 4. SERVICIOS Y PETICIONES API
// ==========================================
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

async function editarCategoria(id, datos) {
  try {
    const res = await fetch(`${URL_BASE}/categorias/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datos),
    });
    return res.ok;
  } catch (error) {
    console.error("Error al editar categoria:", error);
    return false;
  }
}

async function eliminarCategoria(id) {
  try {
    const res = await fetch(`${URL_BASE}/categorias/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch (error) {
    console.error("Error al eliminar categoria:", error);
    return false;
  }
}

// ==========================================
// 5. FUNCIONES DE RENDERIZADO DOM
// ==========================================
function renderCategorias(categorias) {
  if (dataTable) {
    dataTable.destroy();
    dataTable = null;
  }

  const tbody = document.getElementById("tablaCategoriasBody");
  const thead = document.querySelector("thead");

  if (!categorias || categorias.length === 0) {
    thead.classList.add("d-none");
    tbody.innerHTML = `
      <tr>
        <td colspan="3" class="text-center py-5 text-muted">
          <i class="bi bi-tags fs-1 d-block mb-2"></i>
          Aún sin categorías. ¡Agrega una para poder agregar gastos, verla, modificarla o eliminarla!
        </td>
      </tr>`;
    return;
  }

  thead.classList.remove("d-none");
  tbody.innerHTML = categorias
    .map(
      (cat) => `
    <tr>
      <td>${cat.nombre}</td>
      <td>${cat.monto_maximo} €</td>
      <td class="text-center">
        <button class="btn btn-outline-warning btn-sm me-1 btn-editar"
          data-id="${cat.id}"
          data-nombre="${cat.nombre}"
          data-monto="${cat.monto_maximo}">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-outline-danger btn-sm btn-eliminar"
          data-id="${cat.id}">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>`,
    )
    .join("");

  dataTable = new DataTable("#tablaCategorias", {
    language: {
      search: "Buscar:",
      lengthMenu: "Mostrar _MENU_ registros",
      info: "Mostrando _START_ a _END_ de _TOTAL_ categorías",
      infoEmpty: "No hay categorías registradas",
      infoFiltered: "(filtrado de _MAX_ categorías en total)",
      zeroRecords: "No se encontraron categorías con ese criterio",
      emptyTable: "No hay categorías registradas",
      paginate: { next: "Siguiente", previous: "Anterior" },
    },
    columnDefs: [{ orderable: false, targets: 2 }],
  });
}

// ==========================================
// 6. EVENT LISTENERS (INTERACCIONES)
// ==========================================

// --- CONTROL DE APERTURA DE MODALES ---
btnAbrirAgregarCategoria.addEventListener("click", () => {
  modalAgregarCategoria.show();
});

// --- ACCIONES EN LA TABLA (EDITAR / ELIMINAR) ---
tablaCategorias.addEventListener("click", (e) => {
  const btnEditar = e.target.closest(".btn-editar");
  const btnEliminar = e.target.closest(".btn-eliminar");

  if (btnEditar) {
    categoriaIdSeleccionada = btnEditar.dataset.id;
    editCategoriaNombre.value = btnEditar.dataset.nombre;
    editCategoriaMonto.value = btnEditar.dataset.monto;
    modalEditarCategoria.show();
  }

  if (btnEliminar) {
    categoriaIdSeleccionada = btnEliminar.dataset.id;
    modalEliminarCategoria.show();
  }
});

// --- ENVÍO DE FORMULARIOS (SUBMIT) ---
formAgregarCategoria.addEventListener("submit", async (e) => {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(e.target));
  const agregada = await agregarCategoria(datos);
  if (agregada) {
    notificar("Categoria agregada correctamente", "success");
    modalAgregarCategoria.hide();
    e.target.reset();
    const categorias = await obtenerCategorias();
    renderCategorias(categorias);
    return;
  }
  notificar("Error al intentar agregar categoria", "error");
});

formEditarCategoria.addEventListener("submit", async (e) => {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(e.target));
  const editada = await editarCategoria(categoriaIdSeleccionada, datos);
  if (editada) {
    notificar("Categoría editada correctamente.", "success");
    modalEditarCategoria.hide();
    const categories = await obtenerCategorias();
    renderCategorias(categories);
  } else {
    notificar(
      "Error al editar categoría. Por favor, intente nuevamente.",
      "error",
    );
  }
});

// --- CONFIRMACIÓN DE ELIMINACIÓN ---
btnConfirmarEliminar.addEventListener("click", async () => {
  const eliminada = await eliminarCategoria(categoriaIdSeleccionada);
  if (eliminada) {
    notificar("Categoría eliminada correctamente.", "success");
    modalEliminarCategoria.hide();
    const categorias = await obtenerCategorias();
    renderCategorias(categorias);
  } else {
    notificar(
      "Error al eliminar categoría. Por favor, intente nuevamente.",
      "error",
    );
  }
});
