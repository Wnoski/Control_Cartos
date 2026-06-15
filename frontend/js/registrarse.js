// ==========================================
// 1. REFERENCIAS AL DOM
// ==========================================
// Inputs de Formulario
const inputEmailResgistro = document.getElementById("emailRegistro");
const inputPasswordRegistro = document.getElementById("passwordRegistro");
const inputConfirmPasswordRegistro = document.getElementById(
  "confirmPasswordRegistro",
);
const inputNicknameRegistro = document.getElementById("nicknameRegistro");
const inputPresupuesto = document.getElementById("presupuesto");

// Botones y Controles
const btnMostrar = document.getElementById("mostrarContraseña");
const btnRegistrar1 = document.getElementById("btnRegistrar1");
const btnRegistrar2 = document.getElementById("btnRegistrar2");
const btnAtras = document.getElementById("btnAtras");

// Contenedores / Tarjetas (Pasos del Registro)
const card1 = document.getElementById("cardRegistro1");
const card2 = document.getElementById("cardRegistro2");
const card3 = document.getElementById("cardRegistro3");

// ==========================================
// 2. INICIALIZACIÓN DE LA APP
// ==========================================
document.addEventListener("DOMContentLoaded", comprobarToken);

// ==========================================
// 3. SERVICIOS Y PETICIONES API
// ==========================================
async function registrarUsuario(
  email,
  nickname,
  password,
  confirm_password,
  presupuesto,
) {
  try {
    const res = await fetch(`${URL_BASE}/usuarios/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nickname,
        email,
        password,
        confirm_password,
        presupuesto,
      }),
    });

    if (res.ok) {
      return true;
    }
    return false;
  } catch (error) {
    console.warn("Error al registrar usuario:", error);
    return true;
  }
}

async function verificarEmailDuplicado(email) {
  try {
    const res = await fetch(`${URL_BASE}/usuarios/register/duplicado`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      return true;
    }
    return false;
  } catch (error) {
    console.warn("Error al verificar email duplicado:", error);
  }
}

// ==========================================
// 4. EVENT LISTENERS (INTERACCIONES)
// ==========================================

// --- PASO 1: VALIDACIÓN Y COMPROBACIÓN DE DUPLICADO ---
btnRegistrar1.addEventListener("click", async () => {
  const patronEmail = /\.[a-zA-Z]{2,6}$/;
  if (
    !inputEmailResgistro.value ||
    !inputNicknameRegistro.value ||
    !inputPasswordRegistro.value ||
    !inputConfirmPasswordRegistro.value
  ) {
    notificar("Por favor, complete todos los campos.", "error");
    return;
  }

  if (!patronEmail.test(inputEmailResgistro.value)) {
    notificar("El correo electrónico no es válido.", "error");
    return;
  }

  if (inputPasswordRegistro.value !== inputConfirmPasswordRegistro.value) {
    notificar("Las contraseñas no coinciden.", "error");
    return;
  }

  const duplicado = await verificarEmailDuplicado(inputEmailResgistro.value);

  if (duplicado) {
    notificar(
      "Correo electrónico ya registrado. Por favor, use otro correo.",
      "error",
    );
    return;
  }

  card1.classList.add("d-none");
  card2.classList.remove("d-none");
});

// --- PASO 2: ENVÍO Y PROCESAMIENTO DEL REGISTRO ---
btnRegistrar2.addEventListener("click", async () => {
  const email = inputEmailResgistro.value;
  const nickname = inputNicknameRegistro.value;
  const password = inputPasswordRegistro.value;
  const confirmPassword = inputConfirmPasswordRegistro.value;
  const presupuesto = inputPresupuesto.value;

  if (!email || !nickname || !password || !confirmPassword || !presupuesto) {
    notificar("Por favor, complete todos los campos.", "error");
    return;
  }

  const registrado = await registrarUsuario(
    email,
    nickname,
    password,
    confirmPassword,
    presupuesto,
  );
  if (registrado) {
    card2.classList.add("d-none");
    card3.classList.remove("d-none");
    setTimeout(() => {
      window.location.href = "iniciarSesion.html";
    }, 10000);
  } else {
    notificar(
      "Error al registrar usuario. Por favor, intente nuevamente.",
      "error",
    );
  }
});

// --- BOTÓN ATRÁS (VOLVER AL PASO 1) ---
btnAtras.addEventListener("click", () => {
  card2.classList.add("d-none");
  card1.classList.remove("d-none");
});

// --- MOSTRAR / OCULTAR CONTRASEÑAS ---
btnMostrar.addEventListener("click", function () {
  if (this.checked) {
    inputPasswordRegistro.type = "text";
    inputConfirmPasswordRegistro.type = "text";
  } else {
    inputPasswordRegistro.type = "password";
    inputConfirmPasswordRegistro.type = "password";
  }
});
