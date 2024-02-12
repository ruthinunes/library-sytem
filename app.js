const setButtonClick = () => {
  const formBtn = document.getElementById("formButton");

  formBtn.addEventListener("click", (e) => {
    e.preventDefault();
    handleButtonClick();
  });
};

const handleButtonClick = () => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  setUserNick(email, pass);
};

const setUserNick = async (email, pass) => {
  const dataLogin = await fetchDataLogin();

  for (let i = 0; i < dataLogin.length; i++) {
    if (email == dataLogin[i].email && pass == dataLogin[i].password) {
      setLocalStorage(dataLogin[i].nick);
      window.open("frontend/pages/home.html", "_self");
      return;
    }
  }
  window.alert("[ERRO] e-mail ou senha incorretos!");
};

const fetchDataLogin = async () => {
  const res = await fetch("data.json");
  const data = await res.json();
  return data.data.login;
};

const setLocalStorage = (user) => {
  localStorage.setItem("user_nick", JSON.stringify(user));
};

window.onload = setButtonClick;
