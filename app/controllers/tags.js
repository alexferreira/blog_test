
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Post = mongoose.model('Post')

/**
 * List items tagged with a tag
 */

exports.filter = function (req, res) {
  var criteria = { tags: req.param('tag') }
  var perPage = 10
  var page = req.param('page') > 0 ? req.param('page') : 0
  var options = {
    perPage: perPage,
    page: page
  }

  Post
    .find(criteria)
    .populate('user', 'email')
    .sort({'createdAt': -1}) // sort by date
    .limit(options.perPage)
    .skip(options.perPage * options.page)
    .exec(function(err, posts) { 
      if (err) return res.render('500')
      Post.count().exec(function (err, count) {
        res.render('posts/index', {
          title: 'Lista de Posts',
          posts: posts,
          tags: req.tags,
          user: req.user,
          isAuthenticated: req.isAuthenticated(),
          page: page,
          pages: count / perPage
        })
      })
    })
}

exports.list = function (req, res, next) {
  var o = {};
  o.map = function() {
    if (!this.tags) return;

    for (index in this.tags) {
      emit(this.tags[index], 1);
    }
  }

  o.reduce = function(previous, current) {
    var count = 0;

    for (index in current) {
      count += current[index];
    }

    return count;
  }

  o.out = { replace: 'tags' }
  o.verbose = true;
  Post.mapReduce(o, function (err, model, stats) {
    // console.log('map reduce took %d ms', stats.processtime)
    model.find().exec(function (err, tags) {
      req.tags = tags
      next()
    });
  })
  
}