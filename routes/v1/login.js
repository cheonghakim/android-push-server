const express = require('express')
const service = require('../../service/v1/login')
const uuid = require('uuid')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage })
const Firebase = require('../../plugins/firebase')
const { wholeEmailPattern } = require('../../static/regex')

class LoginRouter {
  constructor() {
    this.router = express.Router()
    this.router.post('/', upload.none(), this.login)
    this.router.delete('/logout', upload.none(), this.logout)
  }

  async login(req, res, next) {
    try {
      if (wholeEmailPattern.test(req.body.user_id)) {
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
        const id = uuid.v4()
        req.session.user = {
          user_id: req.body.user_id,
          id,
          user_type: data[0]?.user_type,
        }

        // const timer = setTimeout(async () => {
        //   const message = {
        //     data: {
        //       title: 'TEST',
        //       body: 'TEST 알림이에요~',
        //     },
        //     token: req.body.token,
        //   }
        //   clearTimeout(timer)
        //   const data = await Firebase.send(message)
        //   console.log(data)
        // }, 4000)
        res.status(200).json({ success: true, message: '인증성공', id })
      } else {
        res.status(403).json({ success: false, message: '인증 실패' })
      }
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
