const express = require('express')
const service = require('../../service/v1/login')
const uuid = require('uuid')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage })
const Firebase = require('../../plugins/firebase')
const { wholeEmailPattern } = require('../../static/regex')
const { requireLogin } = require('../../plugins/checkLogin')

class LoginRouter {
  constructor() {
    this.router = express.Router()
    this.router.post('/', upload.none(), this.login)
    this.router.delete('/logout', upload.none(), this.logout)
    this.router.put('/token', upload.none(), this.updateToken)
  }

  async login(req, res, next) {
    try {
      if (!wholeEmailPattern.test(req.body.user_id)) {
        return res
          .status(400)
          .json({ success: false, message: '이메일 형식을 확인해 주세요.' })
      }
      const data = await service.login({
        user_id: req.body.user_id,
        password: req.body.password,
        token: req.body.token,
      })

      if (data) {
        Firebase.registrationToken({
          token: req.body.token,
          topic: 'topic-news',
        })
        const id = uuid.v4()
        req.session.user = {
          user_id: req.body.user_id,
          id,
        }

        // 테스트
        // setInterval(async () => {
        //   const message = {
        //     notification: {
        //       title: 'TEST',
        //       body: '테스트를 진행합니다.테스트를 진행합니다.테스트를 진행합니다.테스트를 진행합니다.테스트를 진행합니다.테스트를 진행합니다.테스트를 진행합니다.테스트를 진행합니다.테스트를 진행합니다.테스트를 진행합니다.테스트를 진행합니다.테스트를 진행합니다.테스트를 진행합니다.테스트를 진행합니다.테스트를 진행합니다.테스트를 진행합니다.',
        //     },
        //     token:
        //       'cQ-8_AZ2SSq_cd4sbW7TUq:APA91bEJt7nOSorGSpDMblEvAHb0GF_FStIgFjt2VLdVMMxpsDnZZtc-G3LgeJNHIsSut9jAirxFbNgbnyhnYpc9DFpbzmln87RAW6Yq6lvZRBlIysU6sEwyBoYhfWC2ZSmHE0-I7pR_',
        //   }
        //   const msg = await Firebase.send(message)
        //   console.log('알림 발송 완료: ' + msg)
        // }, 1000 * 10)

        res.status(200).json({ success: true, message: '인증성공', id })
      } else {
        res.status(403).json({ success: false, message: '인증 실패' })
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: '서버에러' })
    }
  }

  async updateToken(req, requireLogin, res, next) {
    try {
      await service.updateToken({
        user_id: req.body.userId,
        token: req.body.token,
      })
      res.status(200).json({ success: true, message: '업데이트 완료' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: '서버에러' })
    }
  }

  async logout(req, res, next) {
    try {
      await req?.session?.destroy()
      res.status(200).json({ success: true, message: '로그아웃 됨' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: '서버에러' })
    }
  }

  getRouter() {
    return this.router
  }
}

module.exports = new LoginRouter().getRouter()
