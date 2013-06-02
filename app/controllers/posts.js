
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
    title: 'New Post',
    post: new Post({}),
    tags: req.tags
  })
}
