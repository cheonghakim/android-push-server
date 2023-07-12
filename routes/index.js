const express = require('express')
const router = express.Router()
const path = require('path')

/**
 * 진입점
 */
router.get('/', function (req, res, next) {
  try {
    res.status(200).sendFile(path.join(__dirname, '../public', 'index.html'))
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error })
  }
})

module.exports = router
