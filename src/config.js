const serverConfig = require('./server/config')

const DEV = process.env.NODE_ENV === 'development'

export default {
  BASE_URL: DEV ? `http://${serverConfig.host}:${serverConfig.port}` : '/'
}
