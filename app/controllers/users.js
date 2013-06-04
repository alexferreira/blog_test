
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , _ = require('underscore');

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
  res.render('users/signup', {
    title: 'Sign up',
    tags: req.tags,
    user: new User()
  })
}

/**
 * Create user
 */

exports.create = function (req, res) {
  var user = new User(req.body)
  user.provider = 'local'
  user.save(function (err) {
    if (err) {
      return res.render('users/signup', { errors: err.errors, user: user })
    }
    req.logIn(user, function(err) {
      if (err) return next(err)
      return res.redirect('/')
    })
  })
}

/**
 * Show login form
 */

exports.login = function (req, res) {
  res.render('users/login', {
    title: 'Login',
    tags: req.tags,
    message: req.flash('error')
  })
}

/**
 * Session
 */

exports.session = function (req, res) {
  res.redirect('/')
}

/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout()
  res.redirect('/login')
}

/**
 *  Show profile
 */

exports.show = function (req, res) {
  var user = req.user
  res.render('users/show', {
    title: user.email,
    user: user,
    tags: req.tags
  })
}

/**
 * Edit user
 */

exports.edit = function (req, res) {
  var user = req.user
  res.render('users/edit', {
    title: user.email,
    user: user,
    tags: req.tags,
    userId: user.id,
    message: {}
  })
}

/**
 * Update password
 */

exports.update = function(req, res){
  var user = req.user
  user = _.extend(user, req.body)
  user.save(function (err) {
    if (err) return next(err)
    req.logout()
    req.flash('error', 'Senha atualizada com sucesso')
    res.redirect('/login')
  })
}

/**
 * Find user by id
 */

exports.user = function (req, res, next, id) {
  User
    .findOne({ _id : id })
    .exec(function (err, user) {
      if (err) return next(err)
      if (!user) return next(new Error('Failed to load User ' + id))
      req.profile = user
      next()
    })
}
