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
  res.render('new-book', { book: {}, title: "New Book" });
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

/* GETs book detail. */
router.get('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render('book-detail', {book, title: "Details"});
  } else {
    res.sendStatus(404);
  }
}));

/* POST updates book info. */
router.post('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render('index', { books });
}));

/* POST deletes book. */
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render('index', { books });
}));


module.exports = router;
