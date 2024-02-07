const email = document.getElementById("email");
const pass = document.getElementById("password");

const fetchDataLogin = async () => {
  const res = await fetch("../data.json");
  const data = await res.json();
  return data.data.login;
};

const setButtonClick = () => {
  const formBtn = document.getElementById("formButton");

  formBtn.addEventListener("click", (e) => {
    e.preventDefault();
    setUser();
  });
};

const setUser = async () => {
  const dataLogin = await fetchDataLogin();

  getUser(dataLogin);
};

const getUser = (dataLogin) => {
  for (i = 0; i < dataLogin.length; i++) {
    if (
      email.value == dataLogin[i].email &&
      pass.value == dataLogin[i].password
    ) {
      setLocalStorage(dataLogin[i].name);
      window.open("../pages/home.html", "_self");
      return;
    }
  }
  window.alert("[ERRO] e-mail ou senha incorretos!");
};

const setLocalStorage = (user) => {
  localStorage.setItem("user_name", JSON.stringify(user));
};

window.onload = setButtonClick;
