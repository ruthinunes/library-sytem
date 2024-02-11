import { setUserNick, setNavClick, addClass, removeClass } from "./home.js";
import { setOptionsFilterClick } from "./register.js";

const getLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

const setLocalStorage = (key, object) => {
  localStorage.setItem(key, JSON.stringify(object));
};

const setFormInputs = () => {
  const inputs = {
    image: {
      uploadedImg: document.getElementById("uploadedImg"),
      buttonIcon: document.querySelector(".input__icon"),
      inputText: document.querySelector(".input__text"),
      uploadButton: document.querySelector("#inputFile"),
    },
    title: document.getElementById("inputTitle"),
    synopsis: document.querySelector("#inputTextArea"),
    author: document.querySelector("#inputAuthor"),
    genre: document.querySelector(".options__text"),
    systemEntryDate: document.querySelector("#inputDate"),
  };

  fillForm(inputs);
  setSaveButtonClick(inputs);
};

const fillForm = (inputs) => {
  const index = getLocalStorage("edit_id");
  const book = getLocalStorage("db_books")[index];

  inputs.title.value = book.title;
  inputs.synopsis.value = book.synopsis;
  inputs.author.value = book.author;
  inputs.genre.textContent = book.genre;
  inputs.systemEntryDate.value = book.systemEntryDate
    .split("/")
    .reverse()
    .join("-");
  // fill image input
  inputs.image.uploadedImg.setAttribute("src", book.image);
  inputs.image.inputText.setAttribute("hidden", true);
  inputs.image.buttonIcon.setAttribute("hidden", true);
  inputs.image.uploadedImg.removeAttribute("hidden");
  inputs.image.uploadButton.style.border = "none";
};

const setSaveButtonClick = (inputs) => {
  const saveButton = document.querySelector("#saveEdited");

  saveButton.addEventListener("click", () => {
    if (
      inputs.title.value !== "" &&
      inputs.synopsis.value !== "" &&
      inputs.author.value !== "" &&
      inputs.entryDate !== ""
    ) {
      setEditBook(inputs);
    } else {
      alert("Por favor, preencha os campos nescessários!");
    }
  });
};

const setEditBook = (inputs) => {
  const index = getLocalStorage("edit_id");
  const book = getLocalStorage("db_books")[index];

  book.image = inputs.image.uploadedImg.getAttribute("src");
  book.title = inputs.title.value;
  book.synopsis = inputs.synopsis.value;
  book.author = inputs.author.value;
  book.genre = inputs.genre.textContent;
  book.systemEntryDate = inputs.systemEntryDate.value
    .split("-")
    .reverse()
    .join("/");

  updateEditedBook(index, book);
};

const setCancelButtonClick = () => {
  const cancelButton = document.querySelector("#cancelButton");

  cancelButton.addEventListener("click", () => {
    returnToLibrary();
  });
};

const updateEditedBook = (index, book) => {
  const books = getLocalStorage("db_books");
  books[index] = book;

  setLocalStorage("db_books", books);
  alert("Livro editado com sucesso!");
  returnToLibrary();
};

const returnToLibrary = () => {
  window.open("./library.html", "_self");
  localStorage.removeItem("edit_id");
};

window.addEventListener("DOMContentLoaded", () => {
  setFormInputs();
  setCancelButtonClick();
});
