const setUserNick = () => {
  const user = JSON.parse(localStorage.getItem("user_nick"));
  return (document.getElementById("userNick").innerHTML = user);
};

const setDataBooks = async () => {
  const res = await fetch("../data.json");
  const data = await res.json();
  const dataBooks = data.data.books;

  if ("db_books" in localStorage == false) {
    localStorage.setItem("db_books", JSON.stringify(dataBooks));
  }
};

const setCardsClick = () => {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      setCardURL(card);
    });
  });
};

const setCardURL = (card) => {
  const page = card.id;

  switch (page) {
    case "register":
      window.location.href = "register.html";
      break;
    case "library":
      window.location.href = "library.html";
      break;
    case "history":
      window.location.href = "history.html";
      break;
  }
};

const setNavClick = () => {
  const navButton = document.getElementById("navButton");
  navButton.addEventListener("click", () => {
    displayMenu();
  });
};

const displayMenu = () => {
  const navIcon = document.querySelector(".nav__icon-toggle");
  const navList = document.querySelector(".nav__menu");

  if (navList.classList.contains("show-menu")) {
    removeClass(navList, "show-menu"), removeClass(navIcon, "rotate-icon");
  } else {
    addClass(navList, "show-menu"), addClass(navIcon, "rotate-icon");
  }
  setLogout();
};

const addClass = (element, className) => {
  element.classList.add(className);
};

const removeClass = (element, className) => {
  element.classList.remove(className);
};

const setLogout = () => {
  const navLogout = document.getElementById("navLogout");

  navLogout.addEventListener("click", () => {
    window.location.href = "../pages/login.html";
    localStorage.clear();
  });
};

window.addEventListener("DOMContentLoaded", () => {
  setUserNick();
  setDataBooks();
  setCardsClick();
  // openMenu();
  setNavClick();
});

export { setUserNick, setNavClick, setLogout };
