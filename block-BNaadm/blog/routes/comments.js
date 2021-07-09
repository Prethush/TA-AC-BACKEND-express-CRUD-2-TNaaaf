let express = require('express');
let router = express.Router();
let Comment = require('../models/comments');
let Article = require('../models/articles');

router.get('/:id/edit', (req, res, next) => {
    let id = req.params.id;
    Comment.findById(id, (err, comment) => {
        if(err) return next(err);
        res.render('updateCommentForm', {comment});
    })
});

router.post('/:id', (req, res, next) => {
    let id = req.params.id;
    Comment.findByIdAndUpdate(id, req.body, (err, comment) => {
       if(err) return next(err);
       res.redirect('/articles/' + comment.articleId); 
    })
});

router.get('/:id/delete', (req, res, next) => {
    let id = req.params.id;
    Comment.findByIdAndDelete(id, (err, comment) => {
        if(err) return next(err);
        Article.findByIdAndUpdate(comment.articleId, {$pull: {comment: id}}, (err, article) => {
            if(err) return next(err);
            res.redirect('/articles/' + comment.articleId);
        })
    })
});

router.get('/:id/likes', (req, res, next) => {
    let id = req.params.id;
    Comment.findByIdAndUpdate(id, {$inc: {likes: 1}}, (err, comment) => {
        if(err) return next(err);
        res.redirect('/articles/' + comment.articleId);
    })
});

module.exports = router;