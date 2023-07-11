function requireLogin(req, res, next) {
  if (req.session.cookie) {
    next()
  } else {
    res.status(401).json({ success: false, message: '로그인을 해주세요.' })
  }
}

module.exports = { requireLogin }
