/**
 * page about
 */

exports.about = function (req, res) {
  res.render('pages/about',{
    tags: req.tags,
    user: req.user,
    isAuthenticated: req.isAuthenticated()
  })
}
