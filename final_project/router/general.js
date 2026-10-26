const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Регистрация нового пользователя
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Customer already exists!" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
});

// Task 1 & Task 10: Получить весь список книг (с использованием Promise/Async-Await)
public_users.get('/', async function (req, res) {
  try {
    const getBooks = () => Promise.resolve(books);
    const bookList = await getBooks();
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 2 & Task 11: Получить книгу по ISBN (с использованием Promise/Async-Await)
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  const findBookByISBN = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books
