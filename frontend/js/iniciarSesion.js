const formLogin = document.getElementById("formLogin");

const emailLogin = document.getElementById("emailLogin");

const passwordLogin = document.getElementById("passwordLogin");

const btnLogin = document.getElementById("btnEnviarLogin");

formLogin.addEventListener("submit", (e) => e.preventDefault());

btnLogin.addEventListener("click", async () => {
  const email = emailLogin.value;
  const password = passwordLogin.value;

  if (email === "" || password === "") {
    alert("Por favor, complete todos los campos.");
    return;
  }

  const conectado = await iniciarSesion(email, password);

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

async function iniciarSesion(email, password) {
  try {
    const res = await fetch("http://localhost:8000/usuarios/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    if (res.ok) {
      const data = await res.json();

      localStorage.setItem("token", data.usuario.token);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return false;
  }
}
