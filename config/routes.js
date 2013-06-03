
/**
 * Module dependencies.
 */

var async = require('async')
  , users = require('../app/controllers/users')
  , tags = require('../app/controllers/tags')
  , posts = require('../app/controllers/posts')
  , comments = require('../app/controllers/comments');

module.exports = function (app, passport, auth) {
  app.get('*', tags.list)

  // user routes
  app.get('/signup', users.signup)
  app.post('/users', users.create)
  app.get('/logout', users.logout)
  app.get('/login', users.login)
  app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid email or password.'}), users.session)
  app.get('/users/:userId', users.show)
  
  app.param('userId', users.user)

  // post routes
  app.get('/posts', posts.index)
  app.get('/posts/new', auth.requiresLogin, posts.new)
  app.post('/posts', auth.requiresLogin, posts.create)
  app.get('/posts/:slug', posts.show)
  app.get('/posts/:slug/edit', auth.requiresLogin, auth.post.hasAuthorization, posts.edit)
  app.put('/posts/:slug', auth.requiresLogin, auth.post.hasAuthorization, posts.update)
  app.del('/posts/:slug', auth.requiresLogin, auth.post.hasAuthorization, posts.destroy)

  app.param('slug', posts.post)
  
  app.get('/', posts.index)

  // comment routes
  app.post('/posts/:slug/comments', comments.create)
  app.del('/posts/:slug/comments/:comment_id', auth.requiresLogin, auth.post.hasAuthorization, comments.destroy)

  // tag routes
  app.get('/tags/:tag', tags.filter)
}