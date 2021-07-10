let express = require('express');
let router = express.Router();
let Book = require('../models/books');

router.get('/new', (req, res, next) => {
    res.render('createBookForm');
});




module.exports = router;