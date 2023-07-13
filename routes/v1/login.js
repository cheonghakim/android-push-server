const express = require("express");
const service = require("../../service/v1/login");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const Firebase = require("../../plugins/firebase");
const { wholeEmailPattern } = require("../../static/regex");
const { requireLogin } = require("../../plugins/checkLogin");
const UserModel = require("../../model/user");
const isEmpty = require("lodash/isEmpty");

class LoginRouter {
  constructor() {
    this.router = express.Router();
    this.router.post("/", upload.none(), this.login);
    this.router.delete("/logout", this.logout);
    this.router.put("/token", upload.none(), requireLogin, this.updateToken);
  }

  getRouter() {
    return this.router;
  }

  /**
   * 유저 로그인
   * @param {Object} req
   * @param {RequestBody} req.body
   * @param {Object} res
   * @param {Function} next
   * @returns {Promise<JSON>}
   * @throws {Error}
   *
   * @typedef {Object} RequestBody
   * @property {string} userId - 사용자 아이디
   * @property {string} password - 비밀번호
   * @property {string} token - 토큰
   */
  async login(req, res, next) {
    try {
      if (!wholeEmailPattern.test(req.body.userId)) {
        return res
          .status(400)
          .json({ success: false, message: "이메일 형식을 확인해 주세요." });
      }

      if (isEmpty(req.body.password)) {
        return res
          .status(400)
          .json({ success: false, message: "비밀번호를 입력해 주세요." });
      }

      // 모델 생성
      const userModel = new UserModel({
        userId: req.body.userId,
        password: req.body.password,
        token: req.body.token,
      });

      // 쿼리 조회
      const data = await service.login(userModel);

      if (data) {
        await Firebase.registrationToken({
          token: req.body.token,
          topic: "topic-news",
        });

        res.status(200).json({ success: true, message: "인증성공" });
      } else {
        res.status(403).json({ success: false, message: "인증 실패" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "서버에러" });
    }
  }

  /**
   * 토큰 업데이트
   * @param {Object} req
   * @param {RequestBody} req.body
   * @param {Object} res
   * @param {Function} next
   * @returns {Promise<JSON>}
   * @throws {Error}
   *
   * @typedef {Object} RequestBody
   * @property {string} userId - 사용자 아이디
   * @property {string} token - 토큰
   */
  async updateToken(req, res, next) {
    try {
      const userModel = new UserModel({
        userId: req.body.userId,
        token: req.body.token,
      });
      await service.updateToken(userModel);
      res.status(200).json({ success: true, message: "업데이트 완료" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "서버에러" });
    }
  }

  /**
   * 로그아웃
   * @param {Object} req
   * @param {RequestBody} req.body
   * @param {Object} res
   * @param {Function} next
   * @returns {Promise<JSON>}
   * @throws {Error}
   *
   * @typedef {Object} RequestBody
   * @property {string} userId - 사용자 아이디
   */
  async logout(req, res, next) {
    try {
      const userModel = new UserModel({
        userId: req.query.userId,
      });
      const userData = await service.getToken(userModel);

      if (userData.token) {
        await Firebase.unregistrationToken({
          token: userData?.token,
          topic: "topic-news",
        });
      }

      await service.deleteToken(userModel);
      await req?.session?.destroy();
      res.status(200).json({ success: true, message: "로그아웃 됨" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "서버에러" });
    }
  }
}

module.exports = new LoginRouter().getRouter();
