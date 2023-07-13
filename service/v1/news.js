const { db, getAsync, runAsync, getAllAsync } = require('../../plugins/mysql')

module.exports = class NewsService {
  /**
   * 뉴스 정보 가져오기
   * @returns {Promise<*>}
   * @throws {Promise<Error>}
   */
  static async getNewsList() {
    try {
      const getSQL = `
       SELECT * from NewsTbl ORDER BY created_date DESC;
      `
      const countRows = await getAllAsync(getSQL)
      return countRows
    } catch (err) {
      await Promise.reject(err)
    }
  }

  /**
   * 뉴스 저장하기
   * @param {NewsModel} newsModel
   * @returns {Promise<*>}
   * @throws {Promise<Error>}
   *
   * @typedef {Object} NewsModel
   * @property {string} createdDate
   * @property {string} title
   * @property {string} content
   * @property {string} link
   * @property {string} author
   * @property {string} feedId
   */
  static async saveNews(newsModel) {
    try {
      const { createdDate, title, content, link, author, feedId } = newsModel

      const query = `
       INSERT INTO NewsTbl
       (created_date, title, content, link, author, feed_id)
       VALUES (?, ?, ?, ?, ?, ?); 
      `
      await runAsync(query, [createdDate, title, content, link, author, feedId])
    } catch (err) {
      await Promise.reject(err)
    }
  }
}
