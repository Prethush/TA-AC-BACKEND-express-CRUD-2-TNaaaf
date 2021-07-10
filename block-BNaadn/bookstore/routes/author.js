let express = require('express');
let router = express.Router();
let Author = require('../models/author');
let Book = require('../models/books');

router.get('/new', (req, res, next) => {
    res.render('createAuthorForm');
});

router.post('/', (req, res, next) => {
    Author.create(req.body, (err, auhtor) => {
        if(err) return next(err);
        res.redirect('/authors');
    })
});

router.get('/', (req, res, next) => {
    Author.find({}, (err, authors) => {
        if(err) return next(err);
        res.render('authorsList', {authors});
    })
});

router.get('/:id', (req, res, next) => {
    let id = req.params.id;
    Author.findById(id).populate('books').exec((err, author) => {
        if(err) return next(err);
        res.render('authorDetails', {author});
    })
})

router.post('/:id/books', (req, res, next) => {
    let id = req.params.id;
    req.body.categories = req.body.categories.trim().split(" ");
    req.body.authorId = id;
    Book.create(req.body, (err, book) => {
        if(err) return next(err);
        Author.findByIdAndUpdate(id, {$push: {books: book.id}}, (err, author) => {
            if(err) return next(err);
            res.redirect('/authors/' + id);
        })
    })
});

router.get('/:id/edit', (req, res, next) => {
    let id = req.params.id;
    Author.findById(id, (err, author) => {
        if(err) return next(err);
        res.render('editAuthorForm', {author});
    })
});

router.post('/:id', (req, res, next) => {
    let id = req.params.id;

    Author.findByIdAndUpdate(id, req.body, (err, author) => {
        if(err) return next(err);
        res.redirect('/authors/' + id);
    })
});

router.get('/:id/delete', (req, res, next) => {
    let id = req.params.id;
    Author.findByIdAndDelete(id, (err, author) => {
        if(err) return next(err);
        Book.deleteMany({authorId: id}, (err, book) => {
            if(err) return next(err);
            res.redirect('/books');
        })
    })
});

router.get('/search', (req, res, next) => {
    console.log(req.body.search);
})

module.exports = router;