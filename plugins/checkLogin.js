function requireLogin(req, res, next) {
  console.log(res.session)
  if (req.session.user && req.session.user.id) {
    next()
  } else {
    res.status(401).json({ success: false, message: '로그인을 해주세요.' })
  }
}

function requireAdmin(req, res, next) {
  if (req.session.user.user_type === 'admin') {
    next()
  } else {
    res.status(403).json({ success: false, message: '권한이 없습니다.' })
  }
}

module.exports = { requireLogin, requireAdmin }
