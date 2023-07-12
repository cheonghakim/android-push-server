const express = require('express')
const path = require('path')

class IndexRouter {
  constructor() {
    this.router = express.Router()
    this.router.get('/', this.getIndex)
  }

  getRouter() {
    return this.router
  }

  getIndex(req, res, next) {
    try {
      res.status(200).sendFile(path.join(__dirname, '../public', 'index.html'))
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: error })
    }
  }
}

module.exports = new IndexRouter().getRouter()
