const { db, getAsync, runAsync, getAllAsync } = require('../../plugins/mysql')

module.exports = class FeedService {
  /**
   * 피드 저장하기
   * @returns {Promise<*>}
   */
  static async saveFeed({ created_date, title, link }) {
    try {
      const query = `
       INSERT INTO FeedTbl
       (created_date, title, link)
       VALUES (?, ?, ?); 
      `
      const getQuery = `SELECT last_insert_rowid();`
      await runAsync(query, [created_date, title, link])
      const lastItem = await getAsync(getQuery)
      return lastItem
    } catch (err) {
      await Promise.reject(err)
    }
  }

  /**
   * 피드 히스토리 저장하기
   * @returns {Promise<*>}
   */
  static async saveFeed({ created_date, title, link }) {
    try {
      const query = `
         INSERT INTO FeedTbl
         (created_date, title, link)
         VALUES (?, ?, ?); 
        `
      const getQuery = `SELECT last_insert_rowid();`
      await runAsync(query, [created_date, title, link])
      const lastItem = await getAsync(getQuery)
      return lastItem
    } catch (err) {
      await Promise.reject(err)
    }
  }
}
