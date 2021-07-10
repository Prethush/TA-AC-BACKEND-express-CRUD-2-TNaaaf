let express = require('express');
let router = express.Router();
let Book = require('../models/books');
let Author = require('../models/author');


//display booklist
router.get('/', (req, res, next) => {
    var value = "";
    if(req.query.search !== null && req.query.search !== '') {
        value = new RegExp(req.query.search, 'i');
    }
    Book.find({title: value}, (err, books) => {
        if(err) return next(err);
        if(books.length === 0) {
            Author.findOne({name: value}).populate('books').exec((err, author) => {
                if(err) return next(err);
                let books = author.books;
                res.render('bookList', {books});
            }) 
        }   else {
                res.render('bookList', {books})
            }

        })
    
    if(req.query.search === '' || req.query.search === null) {
        Book.find({}, (err, books) => {
            if(err) return next(err);
            res.render('bookList', {books});
        })
    }
    })



//searching categories
router.get('/:id/search', (req, res, next) => {
    let id = req.params.id;
    id = new RegExp(id, 'i');
    Book.find({categories: id}, (err, books) => {
        if(err) return next(err);
        if(books.length === 0) {
            res.send(`No Books in this category`);
        }else {
            res.render('bookList', {books});
        }
        
    })
});

//render edit book form
router.get('/:id/edit', (req, res, next) => {
    let id = req.params.id;
    Book.findById(id, req.body, (err, book) => {
        if(err) return next(err);
        book.categories = book.categories.join(" ");
        res.render('editBookForm', {book});
    })
});

//update book
router.post('/:id', (req, res, next) => {
    let id = req.params.id;
    req.body.categories = req.body.categories.trim().split(" ");
    Book.findByIdAndUpdate(id, req.body, (err, book) => {
        if(err) return next(err);
        res.redirect('/authors/' + book.authorId);
    })
});

//delete book
router.get('/:id/delete', (req, res, next) => {
    let id = req.params.id;
    Book.findByIdAndDelete(id, (err, book) => {
        if(err) return next(err);
        Author.findByIdAndUpdate(book.authorId, {$pull: {books: book.id}}, (err, author) => {
            if(err) return next(err);
            res.redirect('/authors/' + book.authorId);
        })
        
    })
});


module.exports = router;