const express = require("express");
const AlarmService = require("../../service/v1/notifications");
const { requireLogin } = require("../../plugins/checkLogin"); // 로그인이 필요한 작업에서 사용

class AlarmRouter {
  constructor() {
    this.router = express.Router();
    this.router.get("/", requireLogin, this.getList);
  }

  getRouter() {
    return this.router;
  }

  /**
   * 알림 리스트를 반환
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   * @returns {Promise<JSON>}
   * @throws {Error}
   */
  async getList(req, res, next) {
    try {
      const data = await AlarmService.getNotificationList();
      res.json({ success: true, message: "성공", data });
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }
}

module.exports = new AlarmRouter().getRouter();
