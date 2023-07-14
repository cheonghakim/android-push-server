const bcrypt = require("bcrypt");

class Crypto {
  constructor(salt = 13) {
    this.salt = salt;
  }

  /**
   * 패스워드를 솔트값과 같이 해싱하는 메소드
   * @param {string} password
   * @returns {string}
   */
  async encyptPassword(password) {
    try {
      const hashedPassword = await bcrypt.hash(password, this.salt);
      return hashedPassword;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * 해싱된 비밀번호와 사용자가 입력한 비밀번호를 비교하는 메소드
   * @param {string} password
   * @param {string} hashedPassword
   * @returns {boolean}
   */
  async compare(password, hashedPassword) {
    try {
      const result = await bcrypt.compare(password, hashedPassword);
      return result;
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Crypto;
