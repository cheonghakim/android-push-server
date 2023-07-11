const { db, getAsync, runAsync, getAllAsync } = require('../../plugins/mysql')

/**
 * 피드 저장하기
 * @returns {Promise<*>}
 */
async function saveFeed({ created_date, title, link }) {
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
async function saveFeed({ created_date, title, link }) {
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

module.exports = {
  saveFeed,
}
