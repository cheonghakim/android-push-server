const { db, getAsync, runAsync, getAllAsync } = require('../../plugins/mysql')

module.exports = class RssService {
  /**
   * RSS 링크 가져오기
   * @returns {Promise<*>}
   * @throws {Promise<Error>}
   */
  static async getRssList() {
    try {
      const getSQL = `
       SELECT * from RssTbl;
      `
      const countRows = await getAllAsync(getSQL)
      return countRows
    } catch (err) {
      await Promise.reject(err)
    }
  }
}
