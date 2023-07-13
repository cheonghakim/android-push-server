const express = require("express");
const NewsService = require("../../service/v1/news");
const { requireLogin } = require("../../plugins/checkLogin");

class NewsRouter {
  constructor() {
    this.router = express.Router();
    this.router.get("/", requireLogin, this.getList);
  }

  getRouter() {
    return this.router;
  }

  /**
   * 뉴스 리스트를 반환
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   * @returns {Promise<JSON>}
   * @throws {Error}
   */
  async getList(req, res, next) {
    try {
      const data = await NewsService.getNewsList();
      res.json({ success: true, message: "성공", data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error });
    }
  }
}

module.exports = new NewsRouter().getRouter();
