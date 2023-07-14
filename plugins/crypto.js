const bcrypt = require("bcrypt");

class Crypto {
  constructor(salt = 13) {
    this.salt = salt;
  }

  async encyptPassword(password) {
    try {
      const hashedPassword = await bcrypt.hash(password, this.salt);
      return hashedPassword;
    } catch (error) {
      console.error(error);
    }
  }

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
