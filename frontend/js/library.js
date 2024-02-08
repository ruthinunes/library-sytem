import { setUserNick, setNavClick, addClass, removeClass } from "./home.js";
import { setOptionsFilterClick } from "./register.js";

// localStorage functions
const getLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

const setLocalStorage = (key, object) => {
  localStorage.setItem(key, JSON.stringify(object));
};

// Cards functions
const createContent = () => {
  const books = getLocalStorage("db_books");
  const container = document.querySelector(".library__content");

  books.forEach((book) => {
    createCard(book, container);
  });
};

const createCard = (book, container) => {
  const div = document.createElement("div");
  div.classList.add("library__card");
  div.setAttribute("data-is_active", book.status.isActive);

  div.innerHTML = `
    <div class="card__content">
      <img src="${book.image}" alt="${book.tittle}" class="card__img" />
      <p class="card__title">${book.tittle}</p>
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
    createCard(book, container);
  });
};

// *** filters ***
const setSearchButtonClick = () => {
  const searchButton = document.querySelector(".search__button");

  searchButton.addEventListener("click", () => {
    handleSearchText();
  });
};

const handleSearchText = () => {
  const searchInput = document.getElementById("searchInput");
  const searchText = searchInput.value;

  getSearchFilteredBooks(searchText);
};

const filterBySearch = (text, books) => {
  const searchText = text.toLowerCase();

  return books.filter((book) => {
    const byTittle = book.tittle.toLowerCase();
    const byAuthor = book.author.toLowerCase();
    const byGenre = book.genre.toLowerCase();

    return (
      byTittle.includes(searchText) ||
      byAuthor.includes(searchText) ||
      byGenre.includes(searchText)
    );
  });
};

const getSearchFilteredBooks = (text) => {
  const books = getLocalStorage("db_books");
  const filteredBooks = filterBySearch(text, books);

  displayFilteredBooks(filteredBooks);
};

const displayFilteredBooks = (books) => {
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

  filterBytOtpion(selectedOption);
};

const filterBytOtpion = (selectedOption) => {
  const filteredBooks = getOpnionBooks(selectedOption);

  displayFilteredBooks(filteredBooks);
};

const getOpnionBooks = (selectedOption) => {
  const books = getLocalStorage("db_books");
  const option = setOptionToProperty(selectedOption);

  if (option !== "systemEntryDate") {
    return filterByGenreOrAuthor(books, option);
  } else {
    return filterByDate(books, option);
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

const filterByDate = (books, prop) => {
  books.sort((a, b) => {
    const dateA = new Date(a[prop].split("/").reverse().join("-"));
    const dateB = new Date(b[prop].split("/").reverse().join("-"));

    return dateA - dateB;
  });

  return books;
};

const filterByGenreOrAuthor = (books, prop) => {
  books.sort((a, b) => {
    if (a[prop] < b[prop]) return -1;
    if (a[prop] > b[prop]) return 1;
  });
  return books;
};

// ***** modals *******
const setCardsClick = () => {
  const cards = document.querySelectorAll(".library__card");

  cards.forEach((card, index) => {
    card.addEventListener("click", () => {
      displayModal(".init__modal");
      insertMainContent(index);
    });
  });
};

const displayModal = (className) => {
  const modal = document.querySelector(className);
  modal.classList.add("active");
};

const closeModal = (modal) => {
  const closeButton = modal.querySelector(".close__modal");

  closeButton.addEventListener("click", () => {
    modal.classList.remove("active");
    removeContent(modal);
  });
};

const insertContent = (content, className) => {
  const modal = document.querySelector(className);
  const modalContent = content;

  insertAdjacentHTML(modal, "beforeend", modalContent);
  closeModal(modal);
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
      ${book.tittle}
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

const createMainModal = (index) => {
  const book = getLocalStorage("db_books")[index];
  const mainContent = mainModalContent(book, index);
  const inactiveFooter = inactiveFooterContent(book);

  if (!book.status.isActive) {
    return mainContent + inactiveFooter;
  } else {
    return mainContent;
  }
};

const insertMainContent = (index) => {
  const mainContent = createMainModal(index);
  const book = getLocalStorage("db_books")[index];

  insertContent(mainContent, ".init__modal");
  setButtonsClick(index, book);
};

const updateMainModal = (index) => {
  const modal = document.querySelector(".init__modal");
  const book = getLocalStorage("db_books")[index];

  modal.innerHTML = createMainModal(index);
  setButtonsClick(index, book);
  closeModal(modal);
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
    setInactiveButtonsStyle(buttons, index);
  } else {
    buttons.loanButton.addEventListener("click", () => {
      displayModal(".sub__modal");
      insertLoanContent(index);
    });

    buttons.editButton.addEventListener("click", () => {
      setLocalStorage("edit_id", index);
      window.open("/pages/edit.html", "_self");
    });

    buttons.inactiveButton.addEventListener("click", () => {
      displayModal(".sub__modal");
      insertInactiveContent(index);
    });

    buttons.historyButton.addEventListener("click", () => {
      displayModal(".sub__modal");
      insertHistoryContent(index, book);
    });
  }
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

const insertLoanContent = (index) => {
  const loanContent = loanModalContent(index);

  insertContent(loanContent, ".sub__modal");
  setLoanButtonClick(index);
};

const setLoanButtonClick = (index) => {
  const loanButton = document.querySelector(".sub__modal .loan__button");

  loanButton.addEventListener("click", () => {
    handleLoanData(index);
  });
};

const handleLoanData = (index) => {
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
    setLoanedBook(data, index);
  }
};

const setLoanedBook = (data, index) => {
  const modal = document.querySelector(".sub__modal");
  const books = getLocalStorage("db_books");

  books[index].loanHistory.push(data);

  setLocalStorage("db_books", books);
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

const insertInactiveContent = (index) => {
  const inactiveContent = inactiveModalContent();

  insertContent(inactiveContent, ".sub__modal");
  setInactiveButtonClick(index);
};

const setInactiveButtonClick = (index) => {
  const inactiveButton = document.querySelector(
    ".sub__modal .inactive__button"
  );

  inactiveButton.addEventListener("click", () => {
    handleInactiveData(index);
  });
};

const handleInactiveData = (index) => {
  const inactiveDescription = document.getElementById("inactiveInput").value;
  if (inactiveDescription === "") {
    alert("Por favor, escreva uma descrição");
  } else {
    const data = inactiveDescription;
    setInactiveBook(data, index);
  }
};

const setInactiveBook = (data, index) => {
  const modal = document.querySelector(".sub__modal");
  const books = getLocalStorage("db_books");

  books[index].status.description = data;
  books[index].status.isActive = false;

  setLocalStorage("db_books", books);
  alert("Livro inativado com suscesso!");
  removeContent(modal);
  updateMainModal(index);
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

const setInactiveButtonsStyle = (buttons, index) => {
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
  inactivateButton.addEventListener("click", () => {
    reactiveBook(index);
    setActiveButtons(buttons);
  });
};

const reactiveBook = (index) => {
  const books = getLocalStorage("db_books");

  books[index].status.description = "";
  books[index].status.isActive = true;

  setLocalStorage("db_books", books);
  alert("Livro reativado!");
  updateMainModal(index);
};

const setActiveButtons = (buttons) => {
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

const insertHistoryContent = (index) => {
  const historyContent = historyModalContent(index);

  insertContent(historyContent, ".sub__modal");
  getBookHistory(index);
  setHistoryFilter();
};

const getBookHistory = (index) => {
  const book = getLocalStorage("db_books")[index];
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

const createCells = (data) => {
  return `<td class="table__data">
  <p>${data}</p> </td>`;
};

const insertTableRows = (columns, cells) => {
  insertAdjacentHTML(columns.student, "afterend", cells.rowStudent);
  insertAdjacentHTML(columns.class, "afterend", cells.rowClassRoom);
  insertAdjacentHTML(columns.withdrawal, "afterend", cells.rowWithdrawal);
  insertAdjacentHTML(columns.delivery, "afterend", cells.rowDelivery);
};

// history modal filter
const setHistoryFilter = () => {
  const filters = document.querySelectorAll(".table__filter");

  filters.forEach((filter) => {
    setFilterClick(filter);
  });
};

const setFilterClick = (filter) => {
  const icon = filter.querySelector(".table__icon");

  filter.addEventListener("click", () => {
    console.log(icon);
    icon.classList.toggle("toggle");
    prevClick(filter);
  });
};

const prevClick = (filter) => {
  const filters = document.querySelectorAll(".table__filter");

  filters.forEach((prevFilter) => {
    const prevIcon = prevFilter.querySelector(".table__icon");

    if (prevFilter !== filter) {
      prevIcon.classList.remove("toggle");
    }
  });
};

window.addEventListener("DOMContentLoaded", () => {
  createContent();
  setSearchButtonClick();
  setOptionsButtonClick();
  setCardsClick();
});

window.addEventListener("beforeunload", function () {
  localStorage.removeItem("filtered_books");
});
