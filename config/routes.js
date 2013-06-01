
/**
 * Module dependencies.
 */

var async = require('async');

module.exports = function (app, passport, auth) {
  // user routes
  var users = require('../app/controllers/users')
  app.get('/signup', users.signup)
  app.post('/users', users.create)
  app.get('/logout', users.logout)
  app.get('/login', users.login)
  app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid email or password.'}), users.session)
  app.get('/users/:userId', users.show)
  
  var home = require('../app/controllers/home')
  app.get('/', home.index)

}