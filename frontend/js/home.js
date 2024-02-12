const setUserNick = () => {
  const user = JSON.parse(localStorage.getItem("user_nick"));
  return (document.getElementById("userNick").innerHTML = user);
};

const setCardsClick = () => {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      handleCardClick(card);
    });
  });
};

const handleCardClick = (card) => {
  const id = card.id;

  setCardURL(id);
};

const setCardURL = (id) => {
  switch (id) {
    case "register":
      window.location.href = "../pages/register.html";
      break;
    case "library":
      window.location.href = "../pages/library.html";
      break;
    case "history":
      window.location.href = "../pages/history.html";
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
  const navList = document.querySelector(".nav__menu");
  const navIcon = document.querySelector(".nav__icon-toggle");

  if (navList.classList.contains("show-menu")) {
    removeClass(navList, "show-menu");
    removeClass(navIcon, "rotate-icon");
  } else {
    addClass(navList, "show-menu");
    addClass(navIcon, "rotate-icon");
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
    window.location.href = "../../index.html";
    localStorage.clear();
  });
};

const setDataBooks = async () => {
  const res = await fetch("../../data.json");
  const data = await res.json();
  const dataBooks = data.data.books;

  if ("db_books" in localStorage == false) {
    localStorage.setItem("db_books", JSON.stringify(dataBooks));
  }
};

window.addEventListener("DOMContentLoaded", () => {
  setUserNick();
  setDataBooks();
  setCardsClick();
  setNavClick();
});

export { setUserNick, setNavClick, addClass, removeClass };
