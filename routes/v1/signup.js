const express = require("express");
const service = require("../../service/v1/signup");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { wholeEmailPattern } = require("../../static/regex");
const UserModel = require("../../model/user");
const isEmpty = require("lodash/isEmpty");
const Crypto = require("../../plugins/crypto");

class SignupRouter {
  constructor() {
    this.router = express.Router();
    this.router.post("/", upload.none(), this.signup);
  }

  getRouter() {
    return this.router;
  }

  /**
   * 알림 리스트를 반환
   * @param {Object} req
   * @param {RequestBody} req.body
   * @param {Object} res
   * @param {Function} next
   * @returns {Promise<JSON>}
   * @throws {Error}
   *
   * @typedef {Object} RequestBody
   * @property {string} userId
   * @property {string} password
   * @property {string} passwordCheck
   * @property {string} token
   */
  async signup(req, res, next) {
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
      if (req.body.password !== req.body.passwordCheck) {
        return res
          .status(400)
          .json({ success: false, message: "비밀번호와 확인 값이 다릅니다." });
      }

      const hashedPw = await new Crypto().encyptPassword(req.body.password);
      const userModel = new UserModel({
        userId: req.body.userId,
        password: hashedPw,
        token: req.body.token,
        updatedDate: `${new Date()}`,
      });

      await service.signup(userModel);
      res.status(200).json({ success: true, message: "성공" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error });
    }
  }
}

module.exports = new SignupRouter().getRouter();
