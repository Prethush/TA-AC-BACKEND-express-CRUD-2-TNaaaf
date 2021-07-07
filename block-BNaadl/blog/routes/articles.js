var express = require('express');
var router = express.Router();
let Article = require('../models/articles');

// Display articles list
router.get('/', function(req, res, next) {
  Article.find({}, (err, articles) => {
    if(err) return next(err);
    res.render('listArticles', {articles: articles});
  })
});

//render create article form
router.get('/new', (req, res, next) => {
  res.render('createArticleForm');
});

//create articles
router.post('/', (req, res, next) => {
  req.body.tags = req.body.tags.trim().split(" ");
  Article.create(req.body, (err, article) => {
    if(err) return next(err);
    res.redirect('/articles');
  })
});

//render a specific article
router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  Article.findById(id, (err, article) => {
    console.log(article.tags);
    if(err) return next(err);
    res.render('articleDetails', {article});
  })
});

//render article edit form
router.get('/:id/edit', (req, res, next) => {
  let id = req.params.id;
  Article.findById(id, (err, article) => {
    article.tags = article.tags.join(" ");
    if(err) return next(err);
    res.render('editArticlesForm', {article});
  })
});

//update specific article
router.post('/:id', (req, res, next) => {
  let id = req.params.id;
  req.body.tags = req.body.tags.trim().split(" ");
  Article.findByIdAndUpdate(id, req.body, (err, article) => {
    if(err) return next(err);
    res.redirect(`/articles/${id}`);
  })
});

//delete specific article

router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndDelete(id, (err, user) => {
    if(err) return next(err);
    res.redirect('/articles');
  })
});

router.get('/:id/like', (req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndUpdate(id, {$inc: {likes: 1}}, (err, article) => {
    if(err) return next(err);
    res.redirect('/articles/' + id); 
  })
});

module.exports = router;
