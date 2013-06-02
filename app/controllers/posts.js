
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

/**
 * Find post by id
 */

exports.post = function(req, res, next, id){
  var User = mongoose.model('User')
  
  Post.findOne({ _id : id }).populate('user', 'email').populate('comments.user').exec(function (err, post) { 
    if (err) return next(err)
    if (!post) return next(new Error('Failed to load post ' + id))
    req.post = post
    next()
  })
}

/**
 * Edit an post
 */

exports.edit = function (req, res) {
  res.render('posts/edit', {
    title: 'Editando '+req.post.title,
    post: req.post,
    tags: req.tags
  })
}

/**
 * Update post
 */

exports.update = function(req, res){
  var post = req.post
  post = _.extend(post, req.body)

  post.save(function (err) {
    if (err) {
      res.render('posts/edit', {
        title: 'Editando Post',
        post: post,
        errors: err.errors
      })
    } else {
      res.redirect('/posts/'+post._id)
    }
  })
}
