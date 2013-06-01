
/**
 * Module dependencies.
 */

var async = require('async');

module.exports = function (app, passport, auth) {

  var home = require('../app/controllers/home')
  app.get('/', home.index)

}