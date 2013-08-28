
/**
 * Module dependencies
 */

var express = require('express')
  , fs = require('fs')
  , passport = require('passport')
  , env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , auth = require('./config/middlewares/authorization')
  , mongoose = require('mongoose')
  , modelsPath = __dirname + '/app/models'

mongoose.connect(config.db)

// Bootstrap models
fs.readdirSync(modelsPath).forEach(function (file) {
  require(modelsPath+'/'+file)
})

// Bootstrap passport config
require('./config/passport')(passport, config)

var app = express()

// Bootstrap application settings
require('./config/express')(app, config, passport)

// Bootstrap routes
require('./config/routes')(app, passport, auth)

// Helpers
app.locals = require('./config/helpers');

// Start the app by listening on <port>
var port = process.env.PORT || 10000
app.listen(port)
console.log('Express app started on port '+port)

// expose app
exports = module.exports = app