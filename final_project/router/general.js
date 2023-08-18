const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
let booksArray = Object.values(books);

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});

        } else {
            return res.status(404).json({message: "User already exists"});
        }
    }
    return res.status(404).json({message: "Unable to register user"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      res.send(JSON.stringify({ books }, null, 4));
    } catch (error) {
      console.error("Error while getting book list:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  let isbn = req.params.isbn;
  try {
      await new Promise(resolve => setTimeout(resolve, 100));
      res.send(books[isbn]);
    } catch (error) {
      console.error("No book was found with this ISBN", error);
      res.status(500).json({message: "Internal server error"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  let author = req.params.author;
  let filtered_books = booksArray.filter((book) => book.author === author);
  try { 
      await new Promise(resolve => setTimeout(resolve, 100));
      res.send(filtered_books);
    } catch (error) {
        console.error("No book was found with this author", error);
        res.status(500).json({messaege: "Internal server error"});
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  let title = req.params.title;
  let books_title = booksArray.filter((book) => book.title === title);
  try {
      await new Promise (resolve => setTimeout(resolve, 100));
      res.send(books_title);
  }   catch (error) {
      console.error("No book was found with this title", error);
      res.status(500).json({message: "Internal server error"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  res.send(books[isbn].reviews)
});

module.exports.general = public_users;
