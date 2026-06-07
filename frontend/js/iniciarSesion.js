const formLogin = document.getElementById("formLogin");

const emailLogin = document.getElementById("emailLogin");

const passwordLogin = document.getElementById("passwordLogin");

const btnLogin = document.getElementById("btnEnviarLogin");

const checkboxLogin = document.getElementById("recordarLogin");

formLogin.addEventListener("submit", (e) => e.preventDefault());

btnLogin.addEventListener("click", async () => {
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
  } else {
    new PNotify({
      title: "Error",
      text: "Correo o contraseña incorrectos intentelo de nuevo",
      type: "error",
    });
  }
});

async function iniciarSesion(email, password, recordar = false) {
  try {
    const res = await fetch(
      `http://localhost:8000/usuarios/login/${recordar}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      },
    );
    console.log(res);
    const data = await res.json();
    console.log(data.detail);
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
