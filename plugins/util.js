const path = require('path')
const fs = require('fs')

class Utils {
  /**
   * 익스프레스 컨트롤러와 디렉토리를 연결한다
   * @param {Express} app - express
   * @param {string} root - 루트 디렉토리
   */
  static setAutoRouter(app, root) {
    const pathRoutesV1 = path.join(root, 'routes', 'v1')
    const files = fs.readdirSync(pathRoutesV1)
    files.forEach((key) => {
      if (key.indexOf('login') === -1) {
        app.use('/api/push/v1', require(path.join(pathRoutesV1, key)))
      }
    })
  }
}

module.exports = {
  setAutoRouter: Utils.setAutoRouter,
}
