class SessionMiddleware {
  /**
   * 로그인 여부를 확인하는 미들웨어
   * @param {Object} req
   * @param {SessionData} req.session
   * @param {Object} res
   * @param {Fuction} next
   */
  static requireLogin(req, res, next) {
    if (req.session?.cookie) {
      next();
    } else {
      res.status(401).json({ success: false, message: "로그인을 해주세요." });
    }
  }
}

module.exports = { requireLogin: SessionMiddleware.requireLogin };
