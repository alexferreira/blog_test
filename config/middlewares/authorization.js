
/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login')
  }
  next();
};

/*
 *  Post authorizations routing middleware
 */

exports.post = {
  hasAuthorization : function (req, res, next) {
    if (req.post.user.id != req.user.id) {
      return res.redirect('/posts/'+req.post.id)
    }
    next();
  }
}
