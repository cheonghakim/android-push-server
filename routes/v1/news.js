const express = require('express')
const NewsService = require('../../service/v1/news')
const { requireLogin } = require('../../plugins/checkLogin')

class NewsRouter {
  constructor() {
    this.router = express.Router()
    this.router.get('/', requireLogin, this.getList)
  }

  getRouter() {
    return this.router
  }

  /**
   * 뉴스 리스트를 반환
   */
  async getList() {
    try {
      const data = await NewsService.getNewsList()
      res.json({ success: true, message: '성공', data })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: error })
    }
  }
}

module.exports = new NewsRouter().getRouter()
