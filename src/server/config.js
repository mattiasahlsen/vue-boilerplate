const path = require('path')
const env = require('dotenv')

if (process.env.NODE_ENV === 'development') {
  env.config({ path: path.join(__dirname, '../../.env.development.local') })
  env.config({ path: path.join(__dirname, '../../.env.development') })
} else if (process.env.NODE_ENV === 'test') {
  env.config({ path: path.join(__dirname, '../../.env.test.local') })
  env.config({ path: path.join(__dirname, '../../.env.test') })
} else if (process.env.NODE_ENV === 'production') {
  env.config({ path: path.join(__dirname, '../../.env.production.local') })
  env.config({ path: path.join(__dirname, '../../.env.production') })
}
env.config({ path: path.join(__dirname, '../../.env.local') })
env.config({ path: path.join(__dirname, '../../.env') })

const DB_USER = process.env.DB_CREDS_USR || process.env.DB_USER
const DB_PASS = process.env.DB_CREDS_PSW || process.env.DB_PASS

const userAndPass = DB_USER && DB_PASS
  ? `${process.env.DB_USER}:${process.env.DB_PASS}@` : ''

module.exports = {
  sessionMaxAge: 1000 * 3600 * 24, // 24 hours
  port: 3000,
  host: process.env.HOST || '127.0.0.1',

  secret: process.env.SECRET,
  db: {
    uri: `mongodb://${userAndPass}${process.env.DB_HOST || '127.0.0.1'}:27017/vueproject?authSource=admin`,
    options: {
      useNewUrlParser: true,
    },
  }
}
