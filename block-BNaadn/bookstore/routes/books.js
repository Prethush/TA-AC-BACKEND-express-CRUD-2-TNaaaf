let express = require('express');
let router = express.Router();
let Book = require('../models/books');
let Author = require('../models/author');
let multer = require('multer');
let path = require('path');

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        console.log(path.join(__dirname, 'public/uploads'));
        cb(null, path.join(__dirname, '../public/uploads'));

     },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});

let upload = multer({storage: storage});

//display booklist
router.get('/', (req, res, next) => {
    let searchOptions = {};
    if(req.query.title != '' || req.query.title != null) {
        searchOptions.title = new RegExp(req.query.title, 'i');
    }
    Book.find(searchOptions, (err, books) => {
        if(err) return next(err);
        res.render('bookList', {books})
      })
    
    });



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
router.post('/:id', upload.single('coverImage'),(req, res, next) => {
    let id = req.params.id;
    req.body.categories = req.body.categories.trim().split(" ");
    Book.findByIdAndUpdate(id, {...req.body, coverImage: req.file.originalname}, (err, book) => {
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