require('./plugins/config')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const { auth, setAutoRouter } = require('./plugins/util')
const SocketManagement = require('./plugins/SocketManagement')
const session = require('express-session')
const bodyParser = require('body-parser')
const RssParser = require('./plugins/rssParser')
const Mail = require('./plugins/mail')
const notifications = require('./service/v1/notifications')
const Firebase = require('./plugins/firebase')
const news = require('./service/v1/news')
const schedule = require('node-schedule')

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
    const SQLiteStore = require('connect-sqlite3')(session)
    this.app.use(express.json())
    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.app.use(bodyParser.json())
    this.app.use(cookieParser())
    this.app.use(express.static(path.join(__dirname, 'public')))
    this.app.use(
      session({
        store: new SQLiteStore(),
        secret: 'your secret',
        cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 1 week
      })
    )
  }

  setupRoutes() {
    const index = require('./routes/index')
    const signup = require('./routes/v1/signup')
    const newsRouter = require('./routes/v1/news')
    const notificationsRouter = require('./routes/v1/notifications')
    const loginRouter = require('./routes/v1/login')
    this.app.use('/', index)
    this.app.use('/api/push/v1/signup', signup)
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

  getNewRss() {
    schedule.scheduleJob('0 0 2 * * *', async () => {
      const parser = new RssParser()
      await parser.init()
      const feeds = await parser.updateRss()
      const targets = await notifications.getAlarmTargets()
      for (let i = 0; i < feeds?.length; i++) {
        this.sendMail({
          newsList: feeds[i].items,
          title: feeds[i].title,
          targets,
        })
      }

      const defaultContent =
        `${feeds[0]?.content}...` || '발송된 메일을 확인하세요.'
      this.pushAlarm({
        title: `${feeds.length}건의 피드가 발송 되었습니다.`,
        content: defaultContent,
        targets,
      })
    })
  }

  async test() {
    const parser = new RssParser()
    await parser.init()
    const feeds = await parser.updateRss()
    const targets = await notifications.getAlarmTargets()
    for (let i = 0; i < feeds?.length; i++) {
      this.sendMail({
        newsList: feeds[i].items,
        title: feeds[i].title,
        targets,
      })
    }

    const defaultContent = '발송된 메일을 확인하세요.'
    this.pushAlarm({
      title: `${feeds.length}건의 피드가 발송 되었습니다.`,
      content: defaultContent,
      targets,
    })
  }

  async pushAlarm({ title, content, targets }) {
    try {
      for (let i = 0; i < targets?.length; i++) {
        try {
          const message = {
            notification: {
              title: title,
              body: content,
            },
            token: targets[i].token,
          }

          await Firebase.send(message)

          console.log(`알림 푸쉬 완료: ${targets[i].user_id}`)
        } catch (error) {
          console.error(error)
          continue
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  async sendMail({ newsList, title, targets }) {
    try {
      const targetMailList = targets?.map((item) => item.user_id) || []
      const mail = new Mail()
      mail.sendWithTargetList({
        targetList: targetMailList,
        title,
        newsList,
      })
    } catch (error) {
      console.error(error)
    }
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
appInstance.startServer(8900)
appInstance.getNewRss()
appInstance.test()

module.exports = appInstance
