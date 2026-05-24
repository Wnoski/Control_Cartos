// ==========================================
// 1. SELECCIÓN DE ELEMENTOS DEL DOM
// ==========================================
const cardPresupuesto = document.getElementById("cardPresupuesto");
const cardCategorias = document.getElementById("cardCategorias");
const grafica = document.getElementById("grafica").getContext("2d");

// ==========================================
// 2. INICIALIZACIÓN / EVENT LISTENERS
// ==========================================
document.addEventListener("DOMContentLoaded", comprobarToken);

// ==========================================
// 3. LOGICA CENTRAL Y PETICIONES API
// ==========================================
async function comprobarToken() {
  const token = localStorage.getItem("token");

  if (!token) window.location.href = "index.html";

  const perfil = await obtenerPerfil(token);
  const dash = await obtenerDatosDashboard(token);
}

async function obtenerPerfil(token) {
  try {
    const res = await fetch("http://127.0.0.1:8000/perfil/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const obj_res = await res.json();
      return obj_res.data;
    }
  } catch (error) {
    alert("error");
  }
}

async function obtenerDatosDashboard(token) {
  try {
    const res = await fetch("http://127.0.0.1:8000/dashboard/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const obj_res = await res.json();
      console.log(obj_res);
      console.log(obj_res.data.categorias);
      renderCategorias(obj_res.data.categorias);
      renderPresupuesto(obj_res.data);
      renderGrafica(obj_res.data.categorias);

      return obj_res;
    }
  } catch (error) {
    alert("error");
  }
}

// ==========================================
// 4. FUNCIONES DE RENDERIZADO (INTERFAZ)
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

  const html = `<h5 class="card-title text-secondary">Presupuesto mensual</h5>
          <h2 id="totalGastado">${datos.total_gastado_global} €</h2>
          <p class="text-secondary mb-1">
            de <span id="presupuestoMax">${datos.presupuesto_maximo} €</span>
          </p>
          <div class="progress mb-2" style="height: 8px">
            <div
              id="barraGlobal"
              class="progress-bar ${colorBarra}"
              style="width: ${Math.min(datos.porcentaje_global, 100)}%"
            ></div>
          </div>
          <p id="mensajeGlobal" class="mb-0">${mensaje}</p>
        </div>`;

  cardPresupuesto.innerHTML = html;
}

function renderCategorias(categorias) {
  if (categorias) {
    const html = categorias
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

    cardCategorias.innerHTML = html;
  } else {
    cardCategorias.innerHTML = `<h2>Aun sin categorias: Animante a agregarlas para tener
      mas control de tus finanzas!!</h2>
      <button>Agregar Categoria</button>`;
  }
}

function renderGrafica(datos) {
  const labels = datos.map((d) => d.categoria);
  const gastos = datos.map((d) => d.total_gastado);
  const colores = datos.map((_, i) => {
    const paleta = [
      "#2ecc71",
      "#f5a623",
      "#e74c3c",
      "#4a9eed",
      "#9b59b6",
      "#e67e22",
    ];
    return paleta[i % paleta.length];
  });

  new Chart(grafica, {
    type: "bar",
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
