const path = require('path')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const config = require('./config')
const authController = require('./controllers/auth')

const app = express()

const DIST = path.join(__dirname, '../../dist')

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'))

if (process.env.NODE_ENV === 'development' || process.env.DEBUG) app.use(morgan('dev'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// CORS
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*')
    next()
  })
}

// mongoose
mongoose.connect(config.db.uri, config.db.options)
app.use(session({
  secret: config.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: config.sessionMaxAge, // expiration time
  },
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))
console.log('Max session age: ' + config.sessionMaxAge + 'ms')
app.use(passport.initialize())
app.use(passport.session())

// passport config
const Account = require('./models/account')
const passportLocalMongoStrategy = Account.authenticate()
passport.use(new LocalStrategy((username, password, done) => {
  // prevent mongo injection
  if (typeof username !== 'string' || typeof password !== 'string') {
    return done(new Error('Username or password is not a string.'))
  }

  // need to modify passportLocalMongoStrategy to remove password hash and salt
  // from user object
  passportLocalMongoStrategy(username, password, (err, user) => {
    if (user) {
      user.hash = user.salt = undefined
    }
    done(err, user)
  })
}))
passport.serializeUser((user, done) => {
  done(null, user._id)
})
passport.deserializeUser((id, done) => {
  Account.findById(id, '-hash -salt', (err, user) => {
    if (err) {
      console.log(err)
      done(err)
    } else done(null, user)
  })
})

// routes
if (process.env.NODE_ENV === 'production') app.use(express.static(DIST))
app.use('/', authController)

app.get('/ping', function(req, res) {
  res.status(200).send('pong!')
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log(err)
    res.status(err.status || 500).json(err)
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log(err)
  res.status(err.status || 500).end()
})

module.exports = app
