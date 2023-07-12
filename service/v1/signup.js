const { db, getAsync, runAsync } = require('../../plugins/mysql')

/**
 * 회원가입
 * @param {string} userId
 * @param {string} password
 * @param {string} token
 * @param {string} updatedDate
 * @returns {Promise<*>}
 */
async function signup(userModel) {
  try {
    const { userId, password, token, updatedDate } = userModel
    const query = `
      INSERT INTO UserTbl (user_id, password, token, updated_date) VALUES (?, ?, ?, ?);
      `
    const data = await runAsync(query, [userId, password, token, updatedDate])
    return data
  } catch (err) {
    await Promise.reject(err)
  }
}

module.exports = {
  signup,
}
