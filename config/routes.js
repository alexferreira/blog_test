
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');

module.exports = function (app, passport, auth) {

  var home = require('../app/controllers/home')
  app.get('/', home.index)

}