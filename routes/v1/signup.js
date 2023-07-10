const express = require('express')
const router = express.Router()
const service = require('../../service/v1/signup')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage })

/**
 * 회원가입
 */
router.post('/', upload.none(), async (req, res, next) => {
  try {
    if (wholeEmailPattern.test(req.body.userId)) {
      return res
        .status(400)
        .json({ success: false, message: '이메일 형식을 확인해 주세요.' })
    }
    await service.signup({
      userId: req.body.userId,
      password: req.body.password,
      token: req.body.token,
      updatedDate: `${new Date()}`,
    })
    res.status(200).json({ success: true, message: '성공' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error })
  }
})

module.exports = router
