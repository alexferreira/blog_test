
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
  
  var home = require('../app/controllers/home')
  app.get('/', home.index)

}