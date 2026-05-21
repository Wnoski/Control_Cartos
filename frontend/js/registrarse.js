const inputEmailResgistro = document.getElementById("emailRegistro");
const inputPasswordRegistro = document.getElementById("passwordRegistro");
const inputConfirmPasswordRegistro = document.getElementById(
  "confirmPasswordRegistro",
);
const inputNicknameRegistro = document.getElementById("nicknameRegistro");

const inputPresupuesto = document.getElementById("presupuesto");

const btnRegistrar1 = document.getElementById("btnRegistrar1");
const btnRegistrar2 = document.getElementById("btnRegistrar2");
const btnAtras = document.getElementById("btnAtras");

const card1 = document.getElementById("cardRegistro1");
const card2 = document.getElementById("cardRegistro2");
const card3 = document.getElementById("cardRegistro3");

btnRegistrar1.addEventListener("click", async () => {
  console.log("click");
  if (
    !inputEmailResgistro.value ||
    !inputNicknameRegistro.value ||
    !inputPasswordRegistro.value ||
    !inputConfirmPasswordRegistro.value
  ) {
    alert("Por favor, complete todos los campos.");
    return;
  }

  if (inputPasswordRegistro.value !== inputConfirmPasswordRegistro.value) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  const duplicado = await verificarEmailDuplicado(inputEmailResgistro.value);

  if (duplicado) {
    new PNotify({
      title: "Error",
      text: "El correo ya está registrado, por favor use otro.",
      type: "error",
    });
    return;
  }

  card1.classList.add("d-none");
  card2.classList.remove("d-none");
});

btnRegistrar2.addEventListener("click", async () => {
  console.log("click2");
  const email = inputEmailResgistro.value;
  const nickname = inputNicknameRegistro.value;
  const password = inputPasswordRegistro.value;
  const confirmPassword = inputConfirmPasswordRegistro.value;
  const presupuesto = inputPresupuesto.value;

  if (!email || !nickname || !password || !confirmPassword || !presupuesto) {
    alert("Por favor, complete todos los campos.");
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
    }, 3500);
  } else {
    new PNotify({
      title: "Error",
      text: "Ocurrió un error al registrar el usuario, por favor intente de nuevo.",
      type: "error",
    });
  }
});

btnAtras.addEventListener("click", () => {
  card2.classList.add("d-none");
  card1.classList.remove("d-none");
});

async function registrarUsuario(
  email,
  nickname,
  password,
  confirm_password,
  presupuesto,
) {
  try {
    const res = await fetch("http://127.0.0.1:8000/usuarios/register", {
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
    const res = await fetch(
      "http://127.0.0.1:8000/usuarios/register/duplicado",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      },
    );

    if (!res.ok) {
      const error = await res.json();
      console.warn(error.detail);
      return true;
    }
    return false;
  } catch (error) {
    console.warn("Error al verificar email duplicado:", error);
    return true;
  }
}
