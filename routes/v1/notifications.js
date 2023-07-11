const express = require('express')
const router = express.Router()
const service = require('../../service/v1/notifications')
const { requireLogin } = require('../../plugins/checkLogin') // 로그인이 필요한 작업에서 사용
const Firebase = require('../../plugins/firebase')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage })

/**
 * 알림 리스트를 반환
 */
router.get('/', requireLogin, async (req, res, next) => {
  try {
    const data = await service.getNotificationList()
    console.log(data)
    res.json({ success: true, message: '성공', data })
  } catch (error) {
    res.status(500).json({ success: false, message: error })
  }
})

/**
 * 관리자 페이지에서 알림 발송
 * @typeof {object} NotificationRequestBody
 * @property {string} title - 제목
 * @property {string} body - 내용
 * @property {object[]} targets - 타겟
 */
router.post('/', requireLogin, upload.none(), async (req, res, next) => {
  try {
    if (req?.body.selectAll) {
      const message = {
        notification: {
          title: req.body.title,
          body: req.body.body,
        },
      }

      const response = await Firebase.sendEach([message])
      if (response) {
        console.log('Successfully sent message:', response)
        res.json({ success: true, message: '성공', data })
      } else {
        res.status(500).json({ success: false, message: '메시지 전송 실패' })
      }
      return
    }

    const data = await service.getAlarmTargets()
    console.log(data)
    if (data) {
      const message = {
        notification: {
          title: req.body.title,
          body: req.body.body,
        },
        token: data,
      }
      const response = await Firebase.sendToTargets(message)
      if (response) {
        console.log('Successfully sent message:', response)
        res.json({ success: true, message: '성공', data })
      } else {
        res.status(500).json({ success: false, message: '메시지 전송 실패' })
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error })
  }
})

module.exports = router
