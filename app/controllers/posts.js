
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , async = require('async')
  , Post = mongoose.model('Post')
  , _ = require('underscore')

/**
 * New post
 */

exports.new = function(req, res){
  res.render('posts/new', {
    title: 'Novo Post',
    post: new Post({}),
    tags: req.tags
  })
}

/**
 * Create an post
 */

exports.create = function (req, res) {
  var post = new Post(req.body)
  post.user = req.user

  post.save(function (err) {
    if (err) {
      res.render('posts/new', {
        title: 'Novo Post',
        post: post,
        errors: err.errors
      })
    } else {
      res.redirect('/posts/'+post._id)
    }
  })
}

/**
 * View an post
 */

exports.show = function(req, res){
  res.render('posts/show', {
    title: req.post.title,
    post: req.post,
    tags: req.tags
  })
}
