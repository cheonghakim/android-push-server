const express = require('express')
const router = express.Router()
const service = require('../../service/v1/news')
const { requireLogin } = require('../../plugins/checkLogin')
const Firebase = require('../../plugins/firebase')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage })

/**
 * 뉴스 리스트를 반환
 */
router.get('/', requireLogin, async (req, res, next) => {
  try {
    const data = await service.getNewsList()
    console.log(data)
    res.send(data).json({ success: true, message: '성공' })
  } catch (error) {
    res.status(500).json({ success: false, message: error })
  }
})

/**
 * 관리자 페이지에서 뉴스 알림을 발송
 */
router.post('/', requireLogin, upload.none(), async (req, res, next) => {
  try {
    const data = await service.getAlarmTargets()
    if (data) {
      const response = await firebase.messaging().send(message)
      if (response) {
        console.log('Successfully sent message:', response)
        res.send(data).json({ success: true, message: '성공' })
      } else {
        res.status(500).json({ success: false, message: '메시지 전송 실패' })
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error })
  }
})

module.exports = router
