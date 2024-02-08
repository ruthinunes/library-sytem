import { setUserNick, setNavClick, addClass, removeClass } from "./home.js";

const getLocalStorage = () => {
  return JSON.parse(localStorage.getItem("db_books")) ?? [];
};

const setLocalStorage = (book) => {
  return localStorage.setItem("db_books", JSON.stringify(book));
};

const updateLocalStorage = (book) => {
  const books = getLocalStorage();
  books.push(book);
  setLocalStorage(books);
};

const setImgUploadClick = () => {
  const button = document.querySelector("#inputFile");
  const inputImg = document.querySelector(".input__img");

  if (button && inputImg) {
    button.addEventListener("click", () => inputImg.click());
    inputImg.addEventListener("change", handleImgUpload);
  }
};

const handleImgUpload = (event) => {
  const file = event.target.files[0];

  if (file) {
    setFileReader(file);
  } else {
    setImgUploadClick();
  }
};

const setFileReader = (file) => {
  const reader = new FileReader();

  reader.readAsDataURL(file);
  reader.addEventListener("load", () => {
    handleReaderResult(reader);
  });
};

const handleReaderResult = (reader) => {
  const imgURL = reader.result;

  setImgLabelStyle(imgURL);
};

const setImgLabelStyle = (imgURL) => {
  const { button, buttonIcon, inputText, inputImg } = setImgLabels();

  button.style.border = "none";
  setAttribute(buttonIcon, "hidden", true);
  setAttribute(inputText, "hidden", true);
  setAttribute(inputImg, "src", imgURL);
  removeAttribute(inputImg, "hidden");
};

const setImgLabels = () => {
  const labels = {
    button: document.querySelector("#inputFile"),
    buttonIcon: document.querySelector(".input__icon"),
    inputText: document.querySelector(".input__text"),
    inputImg: document.getElementById("inputImg"),
  };
  return labels;
};

const setOptionsFilterClick = () => {
  const filterButton = document.querySelector(".filter__button");

  filterButton.addEventListener("click", () => {
    displayOptionsBox();
  });
};

const displayOptionsBox = () => {
  const buttonIcon = document.querySelector(".filter__button-icon");
  const optionsContainer = document.querySelector(".filter__options");

  toggleElement(buttonIcon, "toggle");
  toggleElement(optionsContainer, "active");
  setOptionsClick();
};

const setOptionsClick = () => {
  const options = document.querySelectorAll(".option");

  options.forEach((option) => {
    option.addEventListener("click", (event) => {
      handleOptionClick(event);
    });
  });
};

const handleOptionClick = (event) => {
  const option = event.target.outerText;

  if (option) {
    displayOption(option);
  }
};

const displayOption = (option) => {
  const optionText = document.querySelector(".options__text");
  const buttonIcon = document.querySelector(".filter__button-icon");
  const optionsBox = document.querySelector(".filter__options");

  optionText.textContent = option;
  removeClass(buttonIcon, "toggle");
  removeClass(optionsBox, "active");
};

const setSaveButtonClick = () => {
  const saveButton = document.querySelector("#saveButton");

  if (saveButton) {
    saveButton.addEventListener("click", () => {
      handleFormData();
    });
  }
};

const handleFormData = () => {
  const form = {
    imgInput: document.getElementById("inputImg"),
    imgURL: document.getElementById("inputImg").src,
    title: document.querySelector("#inputTitle").value,
    synopsis: document.querySelector("#inputTextArea").value,
    author: document.querySelector("#inputAuthor").value,
    entryDate: document.querySelector("#inputDate").value,
    option: document.querySelector(".options__text").textContent,
  };

  setSaveBook(form);
};

const setSaveBook = (form) => {
  if (isFormFilled(form)) {
    saveBook(form);
  } else {
    alert("Por favor, preencha os campos nescessários!");
  }
};

const saveBook = (form) => {
  const book = createBook(form);

  setAttribute(form.imgInput, "alt", form.title);
  updateLocalStorage(book);
  alert("Livro salvo com suscesso!!");
  clearForm();
};

const createBook = (form) => {
  const book = {
    tittle: form.title,
    author: form.author,
    genre: form.option,
    status: {
      isActive: true,
      description: "",
    },
    image: form.imgURL,
    systemEntryDate: formatedDate(form.entryDate),
    synopsis: form.synopsis,
    loanHistory: [],
  };
  return book;
};

const formatedDate = (date) => {
  return date.split("-").reverse().join("/");
};

const isFormFilled = (form) => {
  const { title, synopsis, author, entryDate, option } = form;

  if (title && synopsis && author && entryDate && option) {
    return true;
  }
  return false;
};

const setCancelButton = () => {
  const button = document.querySelector("#cancelButton");

  if (button) {
    button.addEventListener("click", () => {
      clearForm();
    });
  }
};

const clearForm = () => {
  const form = document.querySelector(".register__form");
  const optionText = document.querySelector(".options__text");

  optionText.textContent = "Gênero";
  form.reset();
  resetImgLabel();
};

const resetImgLabel = () => {
  const { button, buttonIcon, inputText, inputImg } = setImgLabels();

  button.style.border = "3px dashed #ffc501";
  removeAttribute(buttonIcon, "hidden");
  removeAttribute(inputText, "hidden");
  removeAttribute(inputImg, "src");
  setAttribute(inputImg, "hidden", true);
};

const toggleElement = (element, className) => {
  element.classList.toggle(className);
};

const setAttribute = (element, attribute, value) => {
  element.setAttribute(attribute, value);
};

const removeAttribute = (element, attribute) => {
  element.removeAttribute(attribute);
};

window.addEventListener("DOMContentLoaded", () => {
  setOptionsFilterClick();
  setImgUploadClick();
  setSaveButtonClick();
  setCancelButton();
});

export { setOptionsFilterClick };
