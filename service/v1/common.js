const { db, getAsync, runAsync } = require('../../plugins/mysql')

/**
 * 유저 정보 가져오기
 * @returns {Promise<*>}
 */
async function getUserList() {
  try {
    const getSQL = `
       SELECT user_id, token from UserTbl WHERE user_type != "admin";
      `
    const countRows = await getAsync(getSQL)
    return [countRows]
  } catch (err) {
    await Promise.reject(err)
  }
}

module.exports = {
  getUserList,
}
