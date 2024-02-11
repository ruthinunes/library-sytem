import {
  setHistoryFilter,
  insertTableRows,
  createCells,
  prevClick,
} from "./history.js";
import { setUserNick, setNavClick, addClass, removeClass } from "./home.js";
import { setOptionsFilterClick } from "./register.js";

// localStorage functions
const getLocalStorage = () => {
  return JSON.parse(localStorage.getItem("db_books"));
};

const setLocalStorage = (key, books) => {
  localStorage.setItem(key, JSON.stringify(books));
};

const updateLocalStorage = (index, book) => {
  const books = getLocalStorage();

  books.find((item, id) => {
    if (item.title === book.title) {
      index = id;
    }
  });
  books[index] = book;
  setLocalStorage("db_books", books);
};

// Cards
const createContent = () => {
  const books = getLocalStorage();

  books.forEach((book) => {
    createCard(book);
  });
  setCardsClick(books);
};

const createCard = (book) => {
  const container = document.querySelector(".library__content");
  const div = document.createElement("div");

  div.classList.add("library__card");
  div.setAttribute("data-is_active", book.status.isActive);

  div.innerHTML = `
    <div class="card__content">
      <img src="${book.image}" alt="${book.title}" class="card__img" />
      <p class="card__title">${book.title}</p>
      <div class="card__data">
      <p class="data__author"><span>${book.author}</span></p>
      <p class="data__genre"><span>${book.genre}</span></p>
      <p class="data__date">Entrada: <span>${book.systemEntryDate}</span></p>
      </div>
    </div>
  `;
  container.appendChild(div);
};

const updateCards = (books) => {
  const container = document.querySelector(".library__content");

  container.innerHTML = "";
  books.forEach((book) => {
    createCard(book);
  });
  setCardsClick(books);
};

// *** filters ***
const setSearchInputEvent = () => {
  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", () => {
    handleSearchText();
  });
};

const setSearchButtonClick = () => {
  const searchButton = document.querySelector(".search__button");

  searchButton.addEventListener("click", () => {
    handleSearchText();
  });
};

const handleSearchText = () => {
  const searchInput = document.getElementById("searchInput");
  const searchText = searchInput.value;

  if (searchText !== "") {
    getSearchSortedBooks(searchText);
  }
};

const sortBySearch = (text, books) => {
  const searchText = text.toLowerCase();

  return books.filter((book) => {
    const bytitle = book.title.toLowerCase();
    const byAuthor = book.author.toLowerCase();
    const byGenre = book.genre.toLowerCase();

    return (
      bytitle.includes(searchText) ||
      byAuthor.includes(searchText) ||
      byGenre.includes(searchText)
    );
  });
};

const getSearchSortedBooks = (text) => {
  const books = getLocalStorage("db_books");
  const sortedBooks = sortBySearch(text, books);

  displaySortedBooks(sortedBooks);
};

const displaySortedBooks = (books) => {
  const container = document.querySelector(".library__content");

  if (books.length > 0) {
    updateCards(books);
  } else {
    container.innerHTML = `<h3>Livro não identificado</h3>`;
  }
};

const setOptionsButtonClick = () => {
  const options = document.querySelector(".filter__options");

  options.addEventListener("click", (event) => {
    handleOptionSelected(event);
  });
};

const handleOptionSelected = (event) => {
  const selectedOption = event.target.lastElementChild.textContent;

  sortBytOtpion(selectedOption);
};

const sortBytOtpion = (selectedOption) => {
  const sortedBooks = getOpnionBooks(selectedOption);

  displaySortedBooks(sortedBooks);
};

const getOpnionBooks = (selectedOption) => {
  const books = getLocalStorage("db_books");
  const option = setOptionToProperty(selectedOption);

  if (option !== "systemEntryDate") {
    return sortByGenreOrAuthor(books, option);
  } else {
    return sortByDate(books, option);
  }
};

const setOptionToProperty = (selectedOption) => {
  let prop = "";

  switch (selectedOption) {
    case "Gênero":
      prop = "genre";
      break;
    case "Autor":
      prop = "author";
      break;
    case "Data de entrada":
      prop = "systemEntryDate";
      break;
    default:
      prop = "";
  }
  return prop;
};

const sortByDate = (books, prop) => {
  books.sort((a, b) => {
    const dateA = new Date(a[prop].split("/").reverse().join("-"));
    const dateB = new Date(b[prop].split("/").reverse().join("-"));

    return dateA - dateB;
  });

  return books;
};

const sortByGenreOrAuthor = (books, prop) => {
  books.sort((a, b) => {
    if (a[prop] < b[prop]) return -1;
    if (a[prop] > b[prop]) return 1;
  });
  return books;
};

// ***** modals *******
const setCardsClick = (books) => {
  const cards = document.querySelectorAll(".library__card");

  cards.forEach((card, index) => {
    const book = books[index];
    card.addEventListener("click", () => {
      displayModal(".init__modal");
      insertMainContent(index, book);
    });
  });
};

const displayModal = (className) => {
  const modal = document.querySelector(className);
  modal.classList.add("active");
};

const insertContent = (content, className) => {
  const modal = document.querySelector(className);
  const modalContent = content;

  insertAdjacentHTML(modal, "beforeend", modalContent);
  closeModal(modal);
};

const closeModal = (modal) => {
  const closeButton = modal.querySelector(".close__modal");

  closeButton.addEventListener("click", () => {
    modal.classList.remove("active");
    removeContent(modal);
  });
};

const removeContent = (modal) => {
  modal.classList.remove("active");
  modal.removeChild(modal.lastChild);
};

const insertAdjacentHTML = (element, position, content) => {
  element.insertAdjacentHTML(position, content);
};

// main modal section
const mainModalContent = (book, index) => {
  return `<div class="modal main__modal active" id="mainModal">
<div class="modal__header main__header">
  <img
    id="closeIcon"
    class="close__modal"
    src="../images/moda-icon.svg"
    alt=""
  />
</div>
<div class="modal__body main__body">
  <div class="modal__content" id="${index}">
    <div class="modal__img">
      <img src="${book.image}" alt="" id="modalImg" />
    </div>
    <div class="modal__description">
      <h2 id="modalTitle" class="modal__title">
      ${book.title}
      </h2>
      <div class="modal__text">
        <h4>Sinopse</h4>
        <p id="modalSynopsis">
        ${book.synopsis}
        </p>
        <h4>Autor</h4>
        <p id="modalAuthor">${book.author} </p>
        <h4>Gênero</h4>
        <p id="modalGenres">${book.genre}</p>
        <h4>Data de entrada</h4>
        <p id="modalEntryDate">${book.systemEntryDate}</p>
      </div>
    </div>
  </div>
  <div class="modal__buttons">
    <div class="buttons">
      <div
        id="loanButton"
        class="button button--primary loan__button"
      >
        <img
          id="buttonIcon"
          src="../images/modal_btn-icon.svg"
          alt=""
        />
        <p id="button__text">Emprestar</p>
      </div>
      <button class="button edit__button" id="editButton">
        Editar
      </button>
      <button
        class="button inactive__button"
        id="inactiveButton"
      >
        Desativar
      </button>
      <button class="button history__button" id="historyButton">
        Histórico
      </button>
    </div>
  </div>
</div>`;
};

const createMainModal = (index, book) => {
  const mainContent = mainModalContent(book, index);
  const inactiveFooter = inactiveFooterContent(book, index);

  if (!book.status.isActive) {
    return mainContent + inactiveFooter;
  } else {
    return mainContent;
  }
};

const insertMainContent = (index, book) => {
  const mainContent = createMainModal(index, book);

  insertContent(mainContent, ".init__modal");
  setButtonsClick(index, book);
};

const setButtonsClick = (index, book) => {
  const buttons = {
    loanButton: document.getElementById("loanButton"),
    editButton: document.getElementById("editButton"),
    inactiveButton: document.getElementById("inactiveButton"),
    editButton: document.getElementById("editButton"),
    historyButton: document.getElementById("historyButton"),
  };

  if (!book.status.isActive) {
    setInactiveButtonsStyle(buttons, index, book);
  } else {
    buttons.loanButton.addEventListener("click", () => {
      displayModal(".sub__modal");
      insertLoanContent(book, index);
    });

    buttons.editButton.addEventListener("click", () => {
      setLocalStorage("edit_id", index);
      window.open("../pages/edit.html", "_self");
    });

    buttons.inactiveButton.addEventListener("click", () => {
      displayModal(".sub__modal");
      insertInactiveContent(index, book);
    });

    buttons.historyButton.addEventListener("click", () => {
      displayModal(".sub__modal");
      insertHistoryContent(book);
    });
  }
};

const updateMainModal = (index, book) => {
  const modal = document.querySelector(".init__modal");

  modal.innerHTML = createMainModal(index, book);
  setButtonsClick(index, book);
  closeModal(modal);
};

// loan modal section
const loanModalContent = () => {
  return `<div class="modal loan__modal" id="loanModal">
  <div class="sub__header loan__header">
    <img
      id="closeIcon"
      class="close__modal"
      src="../images/moda-icon.svg"
      alt=""
    />
    <p class="sub__text">Informe os dados do aluno antes de continuar</p>
  </div>
  <div class="sub__body loan__body">
    <form id="loanForm" class="loan__form">
      <input
        type="text"
        id="name"
        placeholder="Nome do aluno"
        required=""
      />
      <input
        type=" text"
        id="class"
        placeholder="Turma"
        required=""
      />
      <input
        type="text"
        id="withdrawalDate"
        placeholder="Data da retirada"
        onfocus="(type='date')"
        required=""
      />
      <input
        type="text"
        id="deliveryDate"
        placeholder="Data de entrega"
        onfocus="(type='date')"
        required=""
      />
    </form>
  </div>
  <div class="sub__footer">
    <div class="button button--primary loan__button">
      <img src="../images/modal_btn-icon.svg" alt="" />Emprestar
    </div>
  </div>
</div>`;
};

const insertLoanContent = (book, index) => {
  const loanContent = loanModalContent();

  insertContent(loanContent, ".sub__modal");
  setLoanButtonClick(book, index);
};

const setLoanButtonClick = (book, index) => {
  const loanButton = document.querySelector(".sub__modal .loan__button");

  loanButton.addEventListener("click", () => {
    handleLoanData(book, index);
  });
};

const handleLoanData = (book, index) => {
  const studentName = document.getElementById("name").value;
  const schoolClass = document.getElementById("class").value;
  const withdrawalDate = document.getElementById("withdrawalDate").value;
  const deliveryDate = document.getElementById("deliveryDate").value;

  if (
    studentName === "" ||
    schoolClass === "" ||
    withdrawalDate === "" ||
    deliveryDate === ""
  ) {
    alert("Por favor, insira todos os dados");
  } else {
    const data = {
      studentName: studentName,
      schoolClass: schoolClass,
      withdrawalDate: formatedDate(withdrawalDate),
      deliveryDate: formatedDate(deliveryDate),
    };
    setLoanedBook(data, book, index);
  }
};

const setLoanedBook = (data, book, index) => {
  const modal = document.querySelector(".sub__modal");

  book.loanHistory.push(data);

  updateLocalStorage(index, book);
  alert("Empréstimo registrado com sucesso!");
  clearForm();
  removeContent(modal);
};

const formatedDate = (date) => {
  return date.split("-").reverse().join("/");
};

const clearForm = () => {
  const form = document.getElementById("loanForm");
  form.reset();
};

// inactive modal section
const inactiveModalContent = () => {
  return `<div class="modal inactive__modal" id="inactiveModal">
  <div class="sub__header inactive__header">
    <img
      id="closeIcon"
      class="close__modal"
      src="../images/moda-icon.svg"
      alt=""
    />
    <p class="sub__text">Inativar livro</p>
</div>
<div class="sub__body inactive__body">
  <textarea id="inactiveInput" cols="30" rows="10" placeholder="Descrição"></textarea>
</div>
<div class="sub__footer buttons inactive__footer">
  <button
        class="button inactive__button active"
        id="inactivateButton"
      >
        Desativar
  </button>
</div>
</div>`;
};

const insertInactiveContent = (index, book) => {
  const inactiveContent = inactiveModalContent();

  insertContent(inactiveContent, ".sub__modal");
  setInactiveButtonClick(index, book);
};

const setInactiveButtonClick = (index, book) => {
  const inactiveButton = document.querySelector(
    ".sub__modal .inactive__button"
  );

  inactiveButton.addEventListener("click", () => {
    handleInactiveData(index, book);
  });
};

const handleInactiveData = (index, book) => {
  const inactiveDescription = document.getElementById("inactiveInput").value;
  if (inactiveDescription === "") {
    alert("Por favor, escreva uma descrição");
  } else {
    const data = inactiveDescription;
    setInactiveBook(data, book, index);
  }
};

const setInactiveBook = (data, book, index) => {
  const modal = document.querySelector(".sub__modal");

  book.status.description = data;
  book.status.isActive = false;

  updateLocalStorage(index, book);
  alert("Livro inativado com suscesso!");
  removeContent(modal);
  updateMainModal(index, book);
};

const inactiveFooterContent = (book) => {
  return `<div class="modal__footer">
  <h4 class="footer__title">Informações da inativação</h4>
  <div class="footer__inactive">
    <h4 class="inactive__title">Motivo</h4>
    <p class="inactive__description">
      ${book.status.description}
    </p>
  </div>
</div>`;
};

const setInactiveButtonsStyle = (buttons, index, book) => {
  const inactivateButton = buttons.inactiveButton;
  const loanButtonText = buttons.loanButton.lastElementChild;

  // loan button
  loanButtonText.innerText = "INATIVO";
  buttons.loanButton.classList.add("inactive");
  // edit button
  buttons.editButton.classList.add("inactive");
  // inactive button
  inactivateButton.innerText = "Ativar";
  inactivateButton.classList.add("active__button");
  setActiveButtonClick(buttons, index, book);
  setHistoryButtonClick(buttons, book);
};

const setActiveButtonClick = (buttons, index, book) => {
  buttons.inactiveButton.addEventListener("click", () => {
    reactiveBook(index, book);
    setActiveButton(buttons);
  });
};

const reactiveBook = (index, book) => {
  book.status.description = "";
  book.status.isActive = true;

  updateLocalStorage(index, book);
  alert("Livro reativado!");
  updateMainModal(index, book);
};

const setActiveButton = (buttons) => {
  const loanButtonText = buttons.loanButton.lastElementChild;

  // loan button
  loanButtonText.innerText = "Emprestar";
  buttons.loanButton.classList.remove("inactive");
  // edit button
  buttons.editButton.classList.remove("inactive");
  // inactive button
  buttons.inactiveButton.innerText = "Desativar";
  buttons.inactiveButton.classList.remove("active__button");
};

const setHistoryButtonClick = (buttons, book) => {
  buttons.historyButton.addEventListener("click", () => {
    displayModal(".sub__modal");
    insertHistoryContent(book);
  });
};

// history modal section
const historyModalContent = () => {
  return `<div
  class="modal history__modal"
  id="HistoryModal"
>
  <div class="sub__header history__header">
    <img
      id="closeIcon"
      class="close__modal"
      src="../images/moda-icon.svg"
      alt=""
    />
  </div>
  <div class="sub__body history__body">
  <table class="table__history">
  <tbody class="table__body">
    <tr class="table__row">
      <th class="table__head" id="student">
        <p class="header__name">Aluno</p>
        <div class="table__filter">
          <img
            class="table__icon"
            src="../images/historyIcon.svg"
            alt=""
          />
          <span class="filter__underline"></span>
        </div>
      </th>
    </tr>
    <tr class="table__row">
      <th class="table__head" id="class">
        <p class="header__name">Turma</p>
        <div class="table__filter">
          <img
            class="table__icon"
            src="../images/historyIcon.svg"
            alt=""
          />
          <span class="filter__underline"></span>
        </div>
      </th>
    </tr>
    <tr class="table__row">
      <th class="table__head" id="withdrawal">
        <p class="header__name">Retirada</p>
        <div class="table__filter">
          <img
            class="table__icon"
            src="../images/historyIcon.svg"
            alt=""
          />
          <span class="filter__underline"></span>
        </div>
      </th>
    </tr>
    <tr class="table__row">
      <th class="table__head" id="delivery">
        <p class="header__name">Entrega</p>
        <div class="table__filter">
          <img
            class="table__icon"
            src="../images/historyIcon.svg"
            alt=""
          />
          <span class="filter__underline"></span>
        </div>
      </th>
    </tr>
  </tbody>
</table>
  </div>
</div>`;
};

const insertHistoryContent = (book) => {
  const historyContent = historyModalContent();

  insertContent(historyContent, ".sub__modal");
  getBookHistory(book);
  setHistoryFilter(book.loanHistory);
};

const getBookHistory = (book) => {
  const history = book.loanHistory;

  if (history.length > 0) {
    handleHistoryData(history);
  }
};

const handleHistoryData = (history) => {
  const columns = {
    student: document.getElementById("student"),
    class: document.getElementById("class"),
    withdrawal: document.getElementById("withdrawal"),
    delivery: document.getElementById("delivery"),
  };

  history.forEach((data) => {
    setTableRows(columns, data);
  });
};

const setTableRows = (columns, data) => {
  const cells = {
    rowStudent: createCells(data.studentName),
    rowClassRoom: createCells(data.schoolClass),
    rowWithdrawal: createCells(data.withdrawalDate),
    rowDelivery: createCells(data.deliveryDate),
  };
  insertTableRows(columns, cells);
};

window.addEventListener("DOMContentLoaded", () => {
  createContent();
  setSearchButtonClick();
  setOptionsButtonClick();
  setSearchInputEvent();
});

window.addEventListener("beforeunload", function () {
  localStorage.removeItem("sort_books");
});
