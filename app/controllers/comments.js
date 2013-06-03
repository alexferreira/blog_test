
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')

/**
 * Create comment
 */

exports.create = function (req, res) {
  var post = req.post;

  if (!req.body.email || !req.body.body) {
    if(!req.body.email) req.flash('error', 'O Email deve ser preenchido')
    if(!req.body.body) req.flash('error', 'O Comentário deve ser preenchido')
    return res.redirect('/posts/'+ post.id)
  }

  post.addComment(req.body, function (err) {
    if (err) return res.render('500')
    res.redirect('/posts/'+ post.id)
  })
}

/**
 * Delete an comment
 */

exports.destroy = function(req, res){
  var post = req.post
  
  post.delComment(req.params.comment_id, function (err) {
    if (err) return res.render('500')
    res.redirect('/posts/'+ post.id)
  })
}