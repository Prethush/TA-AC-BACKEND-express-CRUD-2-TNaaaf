var express = require('express');
var router = express.Router();
let Article = require('../models/articles');
let Comment = require('../models/comments');
let mongoose = require('mongoose');

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
  Article.findById(id).populate('comments').exec((err, article) => {
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
    Comment.deleteMany({articleId: id}, (err, comment) => {
      if(err) return next(err);
      res.redirect('/articles');
    })
    
  })
});

router.get('/:id/like', (req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndUpdate(id, {$inc: {likes: 1}}, (err, article) => {
    if(err) return next(err);
    res.redirect('/articles/' + id); 
  })
});

//creating comments
router.post('/:id/comments', (req, res, next) => {
  let id = req.params.id;
  req.body.articleId = id;
  Comment.create(req.body, (err, comment) => {
    if(err) return next(err);
    Article.findByIdAndUpdate(id, {$push: {comments: comment._id}}, (err, book) => {
      if(err) return next(err);
      res.redirect('/articles/' + id);
    })
  })
});
module.exports = router;
