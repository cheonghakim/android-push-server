const { db, getAsync, runAsync, getAllAsync } = require('../../plugins/mysql')

/**
 * RSS 링크 가져오기
 * @returns {Promise<*>}
 */
async function getRssList() {
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

module.exports = {
  getRssList,
}
