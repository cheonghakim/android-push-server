const express = require('express')
const router = express.Router()
const service = require('../../service/v1/common')
const { requireLogin, requireAdmin } = require('../../plugins/checkLogin')

/**
 * 유저 선택 리스트를 반환
 */
router.get('/user-list', requireLogin, requireAdmin, async (req, res, next) => {
  try {
    const data = await service.getUserList()
    res.send(data).json({ success: true, message: '성공' })
  } catch (error) {
    res.status(500).json({ success: false, message: error })
  }
})

module.exports = router
