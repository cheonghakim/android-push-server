const FeedModel = require('../../model/feed')
const { db, getAsync, runAsync, getAllAsync } = require('../../plugins/mysql')

module.exports = class FeedService {
  /**
   * 피드 저장하기
   * @param {FeedModel} feedModel
   * @returns {Promise<*>}
   * @throws {Promise<Error>}
   *
   * @typedef {Object} FeedModel
   * @property {string} createdDate
   * @property {string} title
   * @property {string} link
   */
  static async saveFeed(feedModel) {
    try {
      const { createdDate, title, link } = feedModel
      const query = `
       INSERT INTO FeedTbl
       (created_date, title, link)
       VALUES (?, ?, ?); 
      `
      const getQuery = `SELECT last_insert_rowid();`
      await runAsync(query, [createdDate, title, link])
      const lastItem = await getAsync(getQuery)
      return lastItem
    } catch (err) {
      await Promise.reject(err)
    }
  }

  /**
   * 피드 히스토리 저장하기
   * @param {FeedModel} feedModel
   * @returns {Promise<*>}
   * @throws {Promise<Error>}
   *
   * @typedef {Object} FeedModel
   * @property {string} createdDate
   * @property {string} title
   * @property {string} link
   */
  static async saveFeedHist(feedModel) {
    try {
      const { createdDate, title, link } = feedModel
      const query = `
         INSERT INTO FeedTbl
         (created_date, title, link)
         VALUES (?, ?, ?); 
        `
      const getQuery = `SELECT last_insert_rowid();`
      await runAsync(query, [createdDate, title, link])
      const lastItem = await getAsync(getQuery)
      return lastItem
    } catch (err) {
      await Promise.reject(err)
    }
  }
}
