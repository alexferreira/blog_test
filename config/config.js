var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')

module.exports = {
  development: {
    root: rootPath
    db: 'mongodb://localhost/BlogTestDev',
    app: {
      name: 'BlogTest'
    },
  },
  test: {
    root: rootPath
    db: 'mongodb://localhost/BlogTestTest',
  },
  production: {
    root: rootPath
    db: 'mongodb://localhost/BlogTest',
  }
}