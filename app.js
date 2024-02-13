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

// report modal
const setReportModal = () => {
  const copyElements = document.querySelectorAll(".copy");

  setCopyMouseOver(copyElements);
  setCopyMouseLeave(copyElements);
  setCopyClick(copyElements);
  setCloseReport();
};

const setCopyMouseOver = (elements) => {
  elements.forEach((element) => {
    element.addEventListener("mouseover", () => displayCopyMessage("Copy"));
  });
};

const setCopyMouseLeave = (elements) => {
  elements.forEach((element) => {
    element.addEventListener("mouseleave", () => removeCopyMessage());
  });
};

const setCopyClick = (elements) => {
  elements.forEach((element) => {
    element.addEventListener("click", () => handleReportClick(element));
  });
};

const handleReportClick = (element) => {
  const text = element.textContent;

  copyToClipboard(text);
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    displayCopyMessage("Copied!");
    setTimeout(() => {
      removeCopyMessage();
    }, 700);
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};

const displayCopyMessage = (text) => {
  const modal = document.querySelector(".report__modal");

  modal.style.opacity = "1";
  modal.innerHTML = text;
};

const removeCopyMessage = () => {
  const modal = document.querySelector(".report__modal");

  modal.style.opacity = "0";
};

const setCloseReport = () => {
  const closeButton = document.querySelector(".report__close");
  const report = document.querySelector(".report");

  closeButton.addEventListener("click", () => {
    report.style.display = "none";
  });
};

window.addEventListener("DOMContentLoaded", function () {
  setReportModal();
  setButtonClick();
});
