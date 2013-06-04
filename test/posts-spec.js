
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , should = require('should')
  , request = require('supertest')
  , app = require('../app')
  , context = describe
  , User = mongoose.model('User')
  , Post = mongoose.model('Post')

var count, cookies

/**
 * Posts tests
 */

describe('Posts', function () {
  before(function (done) {
    // create a user
    var user = new User({
      email: 'foobar@example.com',
      password: 'foobar'
    })
    user.save(done)
  })

  describe('GET /posts', function () {
    it('should respond with Content-Type text/html', function (done) {
      request(app)
      .get('/posts')
      .expect('Content-Type', /html/)
      .expect(200)
      // .expect(/List of Posts/)
      .end(done)
    })
  })

  describe('GET /posts/new', function () {
    context('When not logged in', function () {
      it('should redirect to /login', function (done) {
        request(app)
        .get('/posts/new')
        .expect('Content-Type', /plain/)
        .expect(302)
        .expect('Location', '/login')
        .expect(/Moved Temporarily/)
        .end(done)
      })
    })

    context('When logged in', function () {
      before(function (done) {
        // login the user
        request(app)
        .post('/users/session')
        .field('email', 'foobar@example.com')
        .field('password', 'foobar')
        .end(function (err, res) {
          // store the cookie
          cookies = res.headers['set-cookie'].pop().split(';')[0];
          done()
        })
      })

      it('should respond with Content-Type text/html', function (done) {
        var req = request(app).get('/posts/new')
        req.cookies = cookies
        req
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(/Novo Post/)
        .end(done)
      })
    })
  })

  describe('POST /posts', function () {
    context('When not logged in', function () {
      it('should redirect to /login', function (done) {
        request(app)
        .get('/posts/new')
        .expect('Content-Type', /plain/)
        .expect(302)
        .expect('Location', '/login')
        .expect(/Moved Temporarily/)
        .end(done)
      })
    })

    context('When logged in', function () {
      before(function (done) {
        // login the user
        request(app)
        .post('/users/session')
        .field('email', 'foobar@example.com')
        .field('password', 'foobar')
        .end(function (err, res) {
          // store the cookie
          cookies = res.headers['set-cookie'].pop().split(';')[0];
          done()
        })
      })

      describe('Invalid parameters', function () {
        before(function (done) {
          Post.count(function (err, cnt) {
            count = cnt
            done()
          })
        })

        it('should respond with error', function (done) {
          var req = request(app).post('/posts')
          req.cookies = cookies
          req
          .field('title', '')
          .field('body', 'foo')
          .expect('Content-Type', /html/)
          .expect(200)
          .expect(/Post title cannot be blank/)
          .end(done)
        })

        it('should not save to the database', function (done) {
          Post.count(function (err, cnt) {
            count.should.equal(cnt)
            done()
          })
        })
      })

      describe('Valid parameters', function () {
        before(function (done) {
          Post.count(function (err, cnt) {
            count = cnt
            done()
          })
        })

        it('should redirect to the new post page', function (done) {
          var req = request(app).post('/posts')
          req.cookies = cookies
          req
          .field('title', 'foo')
          .field('body', 'bar')
          .expect('Content-Type', /plain/)
          .expect('Location', /\/posts\//)
          .expect(302)
          .expect(/Moved Temporarily/)
          .end(done)
        })

        it('should insert a record to the database', function (done) {
          Post.count(function (err, cnt) {
            cnt.should.equal(count + 1)
            done()
          })
        })

        it('should save the post to the database', function (done) {
          Post
          .findOne({ title: 'foo'})
          .populate('user')
          .exec(function (err, post) {
            should.not.exist(err)
            post.should.be.an.instanceOf(Post)
            post.title.should.equal('foo')
            post.body.should.equal('bar')
            post.user.email.should.equal('foobar@example.com')
            done()
          })
        })

        describe('Comments', function () {
          before(function (done) {
            Post.count(function (err, cnt) {
              count = cnt
              done()
            })
          })

          it('should insert a comment to the post', function (done) {
            Post
            .findOne({ title: 'foo'})
            // .populate('user')
            .exec(function (err, post) {
              should.not.exist(err)
              // console.log(post)
              var req = request(app).post('/posts/'+post._id+'/comments')
              req.cookies = cookies
              req
              .field('email', 'alex@dsol.com.br')
              .field('body', 'Comentário')
              .expect(302)
              .end(function(err, res){
                Post
                .findOne({ title: 'foo'})
                .populate('user')
                .exec(function (err, post) {
                  should.not.exist(err)
                  // console.log(post)
                  comment = post.comments[0];

                  post.should.be.an.instanceOf(Post)
                  post.title.should.equal('foo')
                  post.body.should.equal('bar')
                  post.user.email.should.equal('foobar@example.com')
                  comment.email.should.equal('alex@dsol.com.br')
                  comment.body.should.equal('Comentário')

                  // console.log(comment)
                  done()
                })

              });
            })
          })

        })
      })
    })
  })

  after(function (done) {
    require('./helper').clearDb(done)
  })
})
