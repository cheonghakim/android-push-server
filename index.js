require("./plugins/config");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { auth, setAutoRouter } = require("./plugins/util");
const SocketManagement = require("./plugins/SocketManagement");
const session = require("express-session");
const bodyParser = require("body-parser");
const RssParser = require("./plugins/rssParser");
const Mail = require("./plugins/mail");
const AlarmService = require("./service/v1/notifications");
const Firebase = require("./plugins/firebase");
const NewsService = require("./service/v1/news");
const schedule = require("node-schedule");
const AlarmModel = require("./model/alarm");
const SQLiteStore = require("connect-sqlite3")(session);

class App {
  constructor() {
    this.app = express();
    this.server = null;
  }

  initialize() {
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandlers();
  }

  setupMiddlewares() {
    this.app.use(express.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    this.app.use(
      session({
        store: new SQLiteStore(),
        secret: process.env.SECRET_KEY,
        cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 1 week,
        resave: false,
        saveUninitialized: true,
      })
    );
    this.app.use(express.static(path.join(__dirname, "public")));

    // ejs test
    // this.app.set('view engine', 'ejs') // ejs 템플릿 엔진 설정
    // this.app.set('views', path.join(__dirname, 'views'))
    // this.app.get('/mail', async (req, res) => {
    //   const newsList = await NewsService.getNewsList()
    //   // 데이터를 전달하여 ejs 파일 렌더링
    //   const data = { newsList }
    //   res.render('mail', data)
    // })
  }

  setupRoutes() {
    const index = require("./routes/index");
    const signup = require("./routes/v1/signup");
    const newsRouter = require("./routes/v1/news");
    const notificationsRouter = require("./routes/v1/notifications");
    const loginRouter = require("./routes/v1/login");
    this.app.use("/", index);
    this.app.use("/api/push/v1/signup", signup);
    this.app.use("/api/push/v1/login", loginRouter);
    this.app.use("/api/push/v1/news", newsRouter);
    this.app.use("/api/push/v1/notifications", notificationsRouter);
    setAutoRouter(this.app, __dirname);
  }

  setupErrorHandlers() {
    this.app.use(function (req, res, next) {
      res.sendStatus(404);
    });

    this.app.use(function (err, req, res, next) {
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};
      res.sendStatus(err.status || 500);
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Promise Rejection:", reason);
    });
  }

  startServer(port) {
    this.server = this.app.listen(port, () => {
      console.log(`서버가 ${this.server.address().port} 번 포트 사용중`);
    });
  }

  getNewRss() {
    // '0 0 2 * * *' => 매일 2시 실행
    schedule.scheduleJob("*/3 * * * *", async () => {
      try {
        const parser = new RssParser();
        await parser.init();
        const feeds = await parser.updateRss();
        const targets = await AlarmService.getAlarmTargets();

        // rss를 순회하면서 메일 푸쉬
        for (let i = 0; i < feeds?.length; i++) {
          this.sendMail({
            newsList: feeds[i].items,
            title: feeds[i].title,
            targets,
          });
        }

        // 알림은 로그인한 전체를 대상으로 발송
        const defaultContent =
          feeds?.items && feeds.items.length > 0 && feeds?.items[0]?.title
            ? `${feeds?.items[0]?.title?.slice(0, 30)}...`
            : "발송된 메일을 확인하세요.";
        this.pushAlarm({
          title: `${feeds.length || 0} 건의 새로운 피드가 발송 되었습니다.`,
          content: defaultContent,
          targets,
        });
      } catch (error) {
        console.error(error);
      }
    });
  }

  async test() {
    try {
      const parser = new RssParser();
      await parser.init();
      const feeds = await parser.updateRss();
      const targets = await AlarmService.getAlarmTargets();

      // rss를 순회하면서 메일과 알림 푸쉬
      for (let i = 0; i < feeds?.length; i++) {
        this.sendMail({
          newsList: feeds[i].items,
          title: feeds[i].title,
          targets,
        });
      }

      const defaultContent =
        feeds?.items && feeds.items.length > 0 && feeds?.items[0]?.title
          ? `${feeds?.items[0]?.title?.slice(0, 30)}...`
          : "발송된 메일을 확인하세요.";
      this.pushAlarm({
        title: `${feeds.length || 0} 건의 새로운 피드가 발송 되었습니다.`,
        content: defaultContent,
        targets,
      });
    } catch (error) {
      console.error(error);
    }
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
          };

          await Firebase.send(message);

          await AlarmService.saveAlarm(
            new AlarmModel({
              title,
              content,
            })
          );
          console.log(`알림 푸쉬 완료: ${targets[i].user_id}`);
        } catch (error) {
          console.error(error);
          continue;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async sendMail({ newsList, title, targets }) {
    try {
      const targetMailList = targets?.map((item) => item.user_id) || [];
      const mail = new Mail();
      mail.sendWithTargetList({
        targetList: targetMailList,
        title,
        newsList,
      });
    } catch (error) {
      console.error(error);
    }
  }

  closeServer() {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
  }
}

function init() {
  const appInstance = new App();
  appInstance.initialize();
  appInstance.startServer(8080);
  appInstance.getNewRss();
  // appInstance.test()
  return appInstance;
}

module.exports = init();
