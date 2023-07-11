const { db, getAsync, runAsync, getAllAsync } = require('../../plugins/mysql')

/**
 * 뉴스 정보 가져오기
 * @returns {Promise<*>}
 */
async function getNewsList() {
  try {
    const getSQL = `
       SELECT * from NewsTbl;
      `
    const countRows = await getAllAsync(getSQL)
    return countRows
  } catch (err) {
    await Promise.reject(err)
  }
}

/**
 * 뉴스 저장하기
 * @returns {Promise<*>}
 */
async function saveNews({
  created_date,
  title,
  content,
  link,
  author,
  feedId,
}) {
  try {
    const query = `
       INSERT INTO NewsTbl
       (created_date, title, content, link, author, feed_id)
       VALUES (?, ?, ?, ?, ?, ?); 
      `
    await runAsync(query, [created_date, title, content, link, author, feedId])
  } catch (err) {
    await Promise.reject(err)
  }
}

module.exports = {
  getNewsList,
  saveNews,
}
