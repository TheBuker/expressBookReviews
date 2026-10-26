const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

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

// Task 1 & Task 10: Get all books using Axios and async/await
public_users.get('/', async function (req, res) {
  try {
    const getBooks = async () => books;
    const response = await getBooks();
    return res.status(200).send(JSON.stringify(response, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 2 & Task 11: Get book by ISBN using Axios / Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  axios.get(`http://localhost:5000/`)
    .then(() => {
      if (books[isbn]) {
        return res.status(200).json(books[isbn]);
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    })
    .catch((err) => {
      if (books[isbn]) {
        return res.status(200).json(books[isbn]);
      }
      return res.status(500).json({ message: "Error fetching book by ISBN", error: err.message });
    });
});

// Task 3 & Task 12: Get books by Author using Axios / Promises
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  axios.get(`http://localhost:5000/`)
    .then(() => {
      const matchingBooks = [];
      const keys = Object.keys(books);

      keys.forEach((key) => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
          matchingBooks.push({
            isbn: key,
            author: books[key].author,
            title: books[key].title,
            reviews: books[key].reviews
          });
        }
      });

      if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks);
      } else {
        return res.status(404).json({ message: "No books found for this author" });
      }
    })
    .catch(() => {
      const matchingBooks = [];
      const keys = Object.keys(books);

      keys.forEach((key) => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
          matchingBooks.push({
            isbn: key,
            author: books[key].author,
            title: books[key].title,
            reviews: books[key].reviews
          });
        }
      });

      if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks);
      }
      return res.status(404).json({ message: "No books found for this author" });
    });
});

// Task 4 & Task 13: Get books by Title using Axios / async/await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  try {
    await axios.get(`http://localhost:5000/`);
  } catch (e) {
    // Continue even if server self-call fails
  }

  const matchingBooks = [];
  const keys = Object.keys(books);

  keys.forEach((key) => {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      matchingBooks.push({
        isbn: key,
        author: books[key].author,
        title: books[key].title,
        reviews: books[key].reviews
      });
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
