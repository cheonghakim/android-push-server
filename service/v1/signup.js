const { db, getAsync, runAsync } = require("../../plugins/mysql");

/**
 * 회원가입
 * @param {UserModel} userModel
 * @returns {Promise<*>}
 * @throws {Promise<Error>}
 *
 * @typedef {Object} UserModel
 * @property {string} userId
 * @property {string} password
 * @property {string} token
 * @property {string} updatedDate
 */
async function signup(userModel) {
  try {
    const { userId, password, token, updatedDate } = userModel;
    const query = `
      INSERT INTO UserTbl (user_id, password, token, updated_date) VALUES (?, ?, ?, ?);
      `;
    const data = await runAsync(query, [userId, password, token, updatedDate]);
    return data;
  } catch (err) {
    await Promise.reject(err);
  }
}

module.exports = {
  signup,
};
