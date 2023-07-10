const path = require('path')
const fs = require('fs')

const utils = {
  // 로그인 체크
  auth(req, res, next) {
    if (!req.session.user) {
      res.status(401).send('로그인 해주세요.')
    } else {
      next()
    }
  },
  setAutoRouter(app, root) {
    const pathRoutesV1 = path.join(root, 'routes', 'v1')
    const files = fs.readdirSync(pathRoutesV1)
    files.forEach((key) => {
      if (key.indexOf('login') === -1) {
        app.use('/api/push/v1', require(path.join(pathRoutesV1, key)))
      }
    })
  },
  paging(index = 1, listCount = 5, pageCount = 5, total) {
    index = Number(index)
    listCount = Number(listCount)
    pageCount = Number(pageCount)
    const p = {
      index,
      listCount,
      total,
      pageCount,
      pageStartNum: 1,
      pageLastNum: 1,
      lastBtn: false,
    }
    p.pageStartNum = Math.floor(p.index / p.pageCount) * p.pageCount + 1
    if (p.index % p.pageCount === 0) {
      p.pageStartNum -= p.pageCount
    }
    if (p.listCount !== 0) {
      const remainListCnt = p.total - p.listCount * (p.pageStartNum - 1)
      let remainPageCnt = Math.floor(remainListCnt / p.listCount)
      if (remainListCnt % p.listCount !== 0) {
        remainPageCnt++
      }
      if (remainListCnt <= p.listCount) {
        p.pageLastNum = p.pageStartNum
      } else if (remainPageCnt <= p.pageCount) {
        p.pageLastNum = remainPageCnt + p.pageStartNum - 1
      } else {
        p.pageLastNum = p.pageCount + p.pageStartNum - 1
      }
      const n = Math.ceil(p.total / p.listCount)
      p.lastBtn = p.pageLastNum !== n && n !== 0
    }
    return p
  },
}

module.exports = utils
