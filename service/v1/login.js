const UserModel = require("../../model/user");
const { getAsync, runAsync } = require("../../plugins/mysql");

module.exports = class LoginService {
  /**
   * 로그인
   * @param {UserModel} userModel
   * @returns {Promise<*>}
   * @throws {Promise<Error>}
   *
   * @typedef {Object} UserModel
   * @property {string} userId
   * @property {string} password
   * @property {string} token
   */
  static async login(userModel) {
    try {
      const { userId, password, token } = userModel;
      const query = `
       SELECT * from UserTbl WHERE user_id = ? AND password = ?;
      `;
      const queryData = await getAsync(query, [userId, password]);
      if (queryData) {
        try {
          // 토큰 업데이트
          if (token) await this.updateToken(userModel);
          return [queryData];
        } catch (error) {
          await Promise.reject(error);
        }
      } else {
        return null;
      }
    } catch (error) {
      await Promise.reject(error);
    }
  }

  /**
   * 토큰 업데이트
   * @param {UserModel} userModel
   * @returns {Promise<*>}
   * @throws {Promise<Error>}
   *
   * @typedef {Object} UserModel
   * @property {string} userId
   * @property {string} token
   */
  static async updateToken(userModel) {
    try {
      const { userId, token } = userModel;
      const query = `
       UPDATE UserTbl 
       SET token = ?, updated_date = ?
       WHERE user_id = ?;
      `;
      await runAsync(query, [token, `${new Date()}`, userId]);
    } catch (err) {
      await Promise.reject(err);
    }
  }

  /**
   * 토큰 가져오기
   * @param {UserModel} userModel
   * @returns {Promise<*>}
   * @throws {Promise<Error>}
   *
   * @typedef {Object} UserModel
   * @property {string} userId
   */
  static async getToken(userModel) {
    try {
      const { userId } = userModel;
      const query = `
         SELECT token 
         FROM UserTbl 
         WHERE user_id = ?;
        `;
      const queryData = await getAsync(query, [userId]);
      const tokenUpdate = new UserModel({ token: queryData?.token });
      return tokenUpdate;
    } catch (err) {
      await Promise.reject(err);
    }
  }

  /**
   * 토큰 삭제
   * @param {UserModel} userModel
   * @returns {Promise<*>}
   * @throws {Promise<Error>}
   *
   * @typedef {Object} UserModel
   * @property {string} userId
   */
  static async deleteToken(userModel) {
    try {
      const { userId } = userModel;
      const query = `
         UPDATE UserTbl 
         SET token = NULL, updated_date = ?
         WHERE user_id = ?;
        `;
      await runAsync(query, [`${new Date()}`, userId]);
    } catch (err) {
      await Promise.reject(err);
    }
  }
};
