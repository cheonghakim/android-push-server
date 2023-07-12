const admin = require('firebase-admin')
const serviceAccount = require('../pushapp-944f8-d3f596451388.json')
class Firebase {
  constructor() {
    this.admin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  }

  async registrationToken({ token, topic }) {
    try {
      const response = await this.admin
        .messaging()
        .subscribeToTopic(token, topic)
      return response
    } catch (error) {
      await Promise.reject(error)
    }
  }

  async unregistrationToken({ token, topic }) {
    try {
      const response = await this.admin
        .messaging()
        .unsubscribeFromTopic(token, topic)
      return response
    } catch (error) {
      await Promise.reject(error)
    }
  }

  /**
   * 단일 대상, 단일 메세지 발송
   * @typeof {object} message
   * @property {object} data | notification
   * @property {token}
   * @returns
   */
  async send(message) {
    try {
      const response = await this.admin.messaging().send(message)
      return response
    } catch (error) {
      await Promise.reject(error)
    }
  }

  async sendEach(messages) {
    try {
      const response = await this.admin.messaging().sendEach(messages)
      return response
    } catch (error) {
      await Promise.reject(error)
    }
  }

  async sendAll(messages) {
    try {
      const response = await this.admin.messaging().sendAll(messages)
      return response
    } catch (error) {
      await Promise.reject(error)
    }
  }

  async sendToTargets(tokens, message) {
    try {
      const response = await this.admin
        .messaging()
        .sendToDevice(tokens, message)
      return response
    } catch (error) {
      await Promise.reject(error)
    }
  }
}

module.exports = new Firebase()
