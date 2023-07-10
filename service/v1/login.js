const { getAsync, runAsync } = require('../../plugins/mysql')

module.exports = class LoginService {
  /**
   * 로그인
   * @param {string} user_id
   * @param {string} password
   * @param {string} token
   * @returns {Promise<*>}
   */
  static async login({ user_id, password, token }) {
    try {
      const query = `
       SELECT * from UserTbl WHERE user_id = ? AND password = ?;
      `
      const queryData = await getAsync(query, [user_id, password])
      if (queryData) {
        try {
          // 토큰 업데이트
          if (token) await this.updateToken({ user_id, password, token })
          return [queryData]
        } catch (error) {
          await Promise.reject(error)
        }
      } else {
        return null
      }
    } catch (error) {
      await Promise.reject(error)
    }
  }

  /**
   * 토큰 업데이트
   * @param {string} user_id
   * @param {string} password
   * @param {string} token
   * @returns {Promise<*>}
   */
  static async updateToken({ user_id, password, token }) {
    try {
      const query = `
       UPDATE UserTbl 
       SET token = ?, updated_date = ?
       WHERE user_id = ? AND password = ?;
      `
      await runAsync(query, [token, `${new Date()}`, user_id, password])
    } catch (err) {
      await Promise.reject(err)
    }
  }
}
