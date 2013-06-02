
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , async = require('async')
  , Post = mongoose.model('Post')
  , _ = require('underscore')

/**
 * List of Posts
 */

exports.index = function(req, res){
  var page = req.param('page') > 0 ? req.param('page') : 0
  var perPage = 10
  var options = {
    perPage: perPage,
    page: page
  }

  Post
    .find({})
    .populate('user', 'email')
    .sort({'createdAt': -1}) // sort by date
    .limit(options.perPage)
    .skip(options.perPage * options.page)
    .exec(function(err, posts) { 
      if (err) return res.render('500')
      Post.count().exec(function (err, count) {
        res.render('posts/index', {
          title: 'Lista de Posts',
          posts: posts,
          tags: req.tags,
          page: page,
          pages: count / perPage
        })
      })
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
  
  Post.findOne({ _id : id }).populate('user', 'email').exec(function (err, post) { 
    if (err) return next(err)
    if (!post) return next(new Error('Failed to load post ' + id))
    req.post = post
    next()
  })
}

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

/**
 * Delete an post
 */

exports.destroy = function(req, res){
  var post = req.post
  post.remove(function(err){
    req.flash('notice', 'Post deletado com sucesso')
    res.redirect('/posts')
  })
}
