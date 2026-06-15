// ==========================================
// 1. REFERENCIAS AL DOM
// ==========================================
const formLogin = document.getElementById("formLogin");
const emailLogin = document.getElementById("emailLogin");
const passwordLogin = document.getElementById("passwordLogin");
const checkboxLogin = document.getElementById("recordarLogin");
const btnMostrar = document.getElementById("mostrarContraseña");

// ==========================================
// 2. INICIALIZACIÓN DE LA APP
// ==========================================
document.addEventListener("DOMContentLoaded", comprobarToken);

// ==========================================
// 3. SERVICIOS Y PETICIONES API
// ==========================================
async function iniciarSesion(email, password, recordar = false) {
  try {
    const res = await fetch(`${URL_BASE}/usuarios/login/${recordar}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.usuario.token);
      if (recordar) {
        document.cookie = `token=${data.usuario.token}; max-age=2592000; path=/; SameSite=Strict`;
      }
      return true;
    }

    notificar(data.detail, "error");
    return false;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return false;
  }
}

// ==========================================
// 4. EVENT LISTENERS (INTERACCIONES)
// ==========================================

// --- PROCESAR EL FORMULARIO DE LOGEO ---
formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailLogin.value;
  const password = passwordLogin.value;
  const recordar = checkboxLogin.checked;

  if (email === "" || password === "") {
    notificar("Complete todos los campos", "error");
    return;
  }

  const conectado = await iniciarSesion(email, password, recordar);

  if (conectado) {
    window.location.href = "dashboard.html";
  }
});

// --- MOSTRAR / OCULTAR CONTRASEÑA ---
btnMostrar.addEventListener("click", function () {
  if (this.checked) {
    passwordLogin.type = "text";
  } else {
    passwordLogin.type = "password";
  }
});
