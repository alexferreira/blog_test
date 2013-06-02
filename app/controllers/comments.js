
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')

/**
 * Create comment
 */

exports.create = function (req, res) {
  var post = req.post;

  if (!req.body.email || !req.body.body) return res.redirect('/posts/'+ post.id)

  post.addComment(req.body, function (err) {
    if (err) return res.render('500')
    res.redirect('/posts/'+ post.id)
  })
}
