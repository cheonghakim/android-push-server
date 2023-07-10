const express = require('express')
const router = express.Router()
const path = require('path')

/**
 * 진입점
 */
router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public', 'index.html'))
})

module.exports = router
