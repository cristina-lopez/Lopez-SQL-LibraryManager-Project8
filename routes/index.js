const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

/* GET home page. Redirects to /books :) */
router.get('/', asyncHandler(async (req, res) => {
  res.redirect('/books');
}));

/* GETs full list of books. :) */
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render('index', { books });
}));

/* GETs create new book page. :) */
router.get('/books/new',  (req, res) => {
  res.render('new-book', { book: {}, title: "New Book"});
});

/* POSTs new book. :) */
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books");
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("new-book", {book, errors: error.errors, title: "New Book"});
    } else {
      throw error;
    }
  }
}));

/* GETs book detail. :) */
router.get('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render('update-book', {book, title: "Details", bookTitle: book.title, 
      bookAuthor: book.author, bookGenre: book.genre, bookYear: book.year});
  } else {
    res.render('page-not-found', {title: "Page Not Found"});
  }
}));

/* POST updates book info. */
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      //console.log(req.body.title);
      await book.update({
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        year: req.body.year
      });
      res.redirect("/books");
    } else {
      res.render('page-not-found', {title: "Page Not Found"});
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render('update-book', { book, errors: error.errors, title: "Details" });
    } else {
      throw error;
    }
  }
}));

/* POST deletes book. */
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    res.render('page-not-found', {title: "Page Not Found"});
  }
}));

module.exports = router;
