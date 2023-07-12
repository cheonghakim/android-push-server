const express = require('express')
const service = require('../../service/v1/login')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage })
const Firebase = require('../../plugins/firebase')
const { wholeEmailPattern } = require('../../static/regex')
const { requireLogin } = require('../../plugins/checkLogin')
const UserModel = require('../../model/user')

class LoginRouter {
  constructor() {
    this.router = express.Router()
    this.router.post('/', upload.none(), this.login)
    this.router.delete('/logout', this.logout)
    this.router.put('/token', upload.none(), requireLogin, this.updateToken)
  }

  getRouter() {
    return this.router
  }

  async login(req, res, next) {
    try {
      if (!wholeEmailPattern.test(req.body.userId)) {
        return res
          .status(400)
          .json({ success: false, message: '이메일 형식을 확인해 주세요.' })
      }

      // 모델 생성
      const user = new UserModel({
        userId: req.body.userId,
        password: req.body.password,
        token: req.body.token,
      })

      // 쿼리 조회
      const data = await service.login(user)

      if (data) {
        Firebase.registrationToken({
          token: req.body.token,
          topic: 'topic-news',
        })

        // 테스트
        // setInterval(async () => {
        //   const message = {
        //     notification: {
        //       title: 'TEST',
        //       body: '테스트를 진행합니다.테스트를 진행합니다.테스트를 진행합니다.테스트를 진행합니다.테스트를 진행합니다.테스트를 진행합니다.테스트를 진행합니다.테스트를 진행합니다.테스트를 진행합니다.테스트를 진행합니다.테스트를 진행합니다.테스트를 진행합니다.테스트를 진행합니다.테스트를 진행합니다.테스트를 진행합니다.테스트를 진행합니다.',
        //     },
        //     token:
        //       'eCxY4-ivQ5i8s6qwX9y8Dl:APA91bGd5yVJQbShur5KwwYoaFE947tmfMYAkGqHqnHoW9AgEIjKQ3NvWNbCarwfCDaNCPoSPTaJpnZ9nwg9oeb9JJk3FWrU1Mj1DwS3Gne3Fuf8bkA617lg4Ixxv0NbFe52g6pfGu4T',
        //   }
        //   const msg = await Firebase.send(message)
        //   console.log('알림 발송 완료: ' + msg)
        // }, 1000 * 10)

        res.status(200).json({ success: true, message: '인증성공' })
      } else {
        res.status(403).json({ success: false, message: '인증 실패' })
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: '서버에러' })
    }
  }

  async updateToken(req, res, next) {
    try {
      const user = new UserModel({
        userId: req.body.userId,
        token: req.body.token,
      })
      await service.updateToken(user)
      res.status(200).json({ success: true, message: '업데이트 완료' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: '서버에러' })
    }
  }

  async logout(req, res, next) {
    try {
      const user = new UserModel({
        userId: req.query.userId,
      })
      const userId = await service.deleteToken(user)
      await req?.session?.destroy()
      res.status(200).json({ success: true, message: '로그아웃 됨' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: '서버에러' })
    }
  }
}

module.exports = new LoginRouter().getRouter()
