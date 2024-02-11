import { setUserNick, setNavClick, addClass, removeClass } from "./home.js";

// localStorage functions
const getLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

const setTableData = () => {
  const books = getLocalStorage("db_books");
  const histories = [];

  books.forEach((book) => {
    if (book.loanHistory.length > 0) {
      getHistoryBook(book, histories);
    }
  });
  handleHistoryData(histories);
  setHistoryFilter(histories);
};

const getHistoryBook = (book, histories) => {
  const allHistory = book.loanHistory;

  allHistory.forEach((data) => {
    const historyData = {
      title: book.title,
      studentName: data.studentName,
      schoolClass: data.schoolClass,
      withdrawalDate: data.withdrawalDate,
      deliveryDate: data.deliveryDate,
    };

    histories.push(historyData);
  });
};

const handleHistoryData = (histories) => {
  histories.forEach((history) => {
    setTableRows(history);
  });
};

const setTableRows = (history) => {
  const cells = {
    rowStudent: createCells(history.studentName),
    rowClassRoom: createCells(history.schoolClass),
    rowBook: createCells(history.title),
    rowWithdrawal: createCells(history.withdrawalDate),
    rowDelivery: createCells(history.deliveryDate),
  };

  const columns = {
    student: document.getElementById("student"),
    class: document.getElementById("class"),
    book: document.getElementById("book"),
    withdrawal: document.getElementById("withdrawal"),
    delivery: document.getElementById("delivery"),
  };

  document.querySelector(".table__history")
    ? insertTableRows(columns, cells)
    : null;
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
  columns.book
    ? insertAdjacentHTML(columns.book, "afterend", cells.rowBook)
    : null;
};

const insertAdjacentHTML = (element, position, content) => {
  element.insertAdjacentHTML(position, content);
};

// history filter
const setHistoryFilter = (histories) => {
  const filters = document.querySelectorAll(".table__filter");

  filters.forEach((filter) => {
    setFilterClick(filter, histories);
  });
};

const setFilterClick = (filter, histories) => {
  const icon = filter.querySelector(".table__icon");

  filter.addEventListener("click", () => {
    icon.classList.toggle("toggle");

    handleFilterValue(filter, histories);
    prevClick(filter);
  });
};

const handleFilterValue = (filter, histories) => {
  const value = filter.parentElement.id;
  const prop = getFilterProp(value);
  let sortedBooks = "";

  if (prop === "withdrawalDate" || prop === "deliveryDate") {
    sortedBooks = sortByDate(histories, prop);
  } else {
    sortedBooks = sortByText(histories, prop);
  }
  displaySortedBooks(sortedBooks);
};

const getFilterProp = (value) => {
  let prop = "";

  switch (value) {
    case "student":
      prop = "studentName";
      break;
    case "class":
      prop = "schoolClass";
      break;
    case "book":
      prop = "title";
      break;
    case "withdrawal":
      prop = "withdrawalDate";
      break;
    case "delivery":
      prop = "deliveryDate";
      break;
    default:
      prop = "";
  }
  return prop;
};

const displaySortedBooks = (sortedBooks) => {
  const tableData = document.querySelectorAll(".table__data");

  tableData.forEach((data) => {
    data.remove();
  });
  handleHistoryData(sortedBooks);
};

const sortByDate = (books, prop) => {
  books.sort((a, b) => {
    const dateA = new Date(a[prop].split("/").reverse().join("-"));
    const dateB = new Date(b[prop].split("/").reverse().join("-"));

    return dateA - dateB;
  });

  return books;
};

const sortByText = (books, prop) => {
  books.sort((a, b) => {
    if (a[prop] < b[prop]) return 1;
    if (a[prop] > b[prop]) return -1;
  });
  return books;
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
  setTableData();
});

export { setHistoryFilter, insertTableRows, createCells, prevClick };
