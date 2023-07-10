require('./plugins/config')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const { auth, setAutoRouter } = require('./plugins/util')
const SocketManagement = require('./plugins/SocketManagement')
const session = require('express-session')
const sess = require('./plugins/session')
const bodyParser = require('body-parser')
const rss = require('./plugins/rssParser')

class App {
  constructor() {
    this.app = express()
    this.server = null
  }

  initialize() {
    this.setupMiddlewares()
    this.setupRoutes()
    this.setupErrorHandlers()
  }

  setupMiddlewares() {
    this.app.use(express.json())
    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.app.use(bodyParser.json())
    this.app.use(cookieParser())
    this.app.use(express.static(path.join(__dirname, 'public')))
    this.app.use(session(sess))
  }

  setupRoutes() {
    const common = require('./routes/v1/common')
    const signup = require('./routes/v1/signup')
    const newsRouter = require('./routes/v1/news')
    const notificationsRouter = require('./routes/v1/notifications')
    const loginRouter = require('./routes/v1/login')

    this.app.use('/api/push/v1/signup', signup)
    this.app.use('/api/push/v1/common', common)
    this.app.use('/api/push/v1/login', loginRouter)
    this.app.use('/api/push/v1/news', newsRouter)
    this.app.use('/api/push/v1/notifications', notificationsRouter)
    setAutoRouter(this.app, __dirname)
  }

  setupErrorHandlers() {
    this.app.use(function (req, res, next) {
      res.sendStatus(404)
    })

    this.app.use(function (err, req, res, next) {
      res.locals.message = err.message
      res.locals.error = req.app.get('env') === 'development' ? err : {}
      res.sendStatus(err.status || 500)
    })
  }

  startServer(port) {
    this.server = this.app.listen(port, () => {
      console.log(`서버가 ${this.server.address().port} 번 포트 사용중`)
    })
  }

  closeServer() {
    if (this.server) {
      this.server.close()
      this.server = null
    }
  }
}

const appInstance = new App()
appInstance.initialize()
appInstance.startServer(8090)

module.exports = appInstance
