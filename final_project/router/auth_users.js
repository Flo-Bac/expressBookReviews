const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();


let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
    }

const authenticatedUser = (username,password)=>{ 
    let validusers = users.filter((user)=> {
        return (user.username === username && user.password === password)
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
    }

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        res.status(404).json({message: "Error loging in"})
    }
    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
          data: password
        }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = {
          accessToken,username
      }
      return res.status(200).send("User successfully logged in");
      } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
      }});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let filtered_book = books[isbn];
    if (filtered_book) {
        let review = req.query.review;
        let reviewer = req.session.authorization["username"];
        if(review) {
            filtered_book["reviews"][reviewer] = review;
            books[isbn] = filtered_book;
        }
        res.send(`The review for the book with ISBN ${isbn} has been added / updated`)
    }
    else{
        res.send("unable to find this ISBN");
    }
    
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const reviewer = req.session.authorization["username"];

    let filtered_book = books[isbn];
    
    if (!filtered_book) {
        return res.send("Unable to find this ISBN");
    }

    if (filtered_book.reviews && filtered_book.reviews[reviewer]) {
        delete filtered_book.reviews[reviewer];
        return res.send("The review was deleted");
    } else {
        return res.send("No review found for this user and ISBN");
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
