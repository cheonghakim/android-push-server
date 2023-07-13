const admin = require("firebase-admin");
const serviceAccount = require("../pushapp-944f8-d3f596451388.json");
class Firebase {
  constructor() {
    this.admin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  /**
   * 사용자 토큰을 파이어 베이스에 구독 신청
   * @param {string} token
   * @param {string} topic
   * @returns {MessagingTopicManagementResponse}
   * @throws {Promise<Error>}
   */
  async registrationToken({ token, topic }) {
    try {
      const response = await this.admin
        .messaging()
        .subscribeToTopic(token, topic);
      return response;
    } catch (error) {
      await Promise.reject(error);
    }
  }

  /**
   * 사용자 토큰을 파이어 베이스에서 구독 끊기
   * @param {string} token
   * @param {string} topic
   * @returns {MessagingTopicManagementResponse}
   * @throws {Promise<Error>}
   */
  async unregistrationToken({ token, topic }) {
    try {
      const response = await this.admin
        .messaging()
        .unsubscribeFromTopic(token, topic);
      return response;
    } catch (error) {
      await Promise.reject(error);
    }
  }

  /**
   * 단일 대상, 단일 메세지 발송
   * @param {Object} message
   * @returns {MessagingTopicManagementResponse}
   * @throws {Promise<Error>}
   *
   * @typedef {Object} message
   * @property {Object} notification
   *
   * @typedef {Object} notification
   * @property {string} title
   * @property {string} body
   */
  async send(message) {
    try {
      const response = await this.admin.messaging().send(message);
      return response;
    } catch (error) {
      await Promise.reject(error);
    }
  }

  /**
   * 전체에게 각각 다른 메세지 발송
   * @param {Array<message>} messages
   * @returns {MessagingTopicManagementResponse}
   * @throws {Promise<Error>}
   *
   * @typedef {Object} message
   * @property {Object} notification
   *
   * @typedef {Object} notification
   * @property {string} title
   * @property {string} body
   */
  async sendEach(messages) {
    try {
      const response = await this.admin.messaging().sendEach(messages);
      return response;
    } catch (error) {
      await Promise.reject(error);
    }
  }

  /**
   * 전체에게 메세지 발송
   * @param {Array<message>} messages
   * @returns {MessagingTopicManagementResponse}
   * @throws {Promise<Error>}
   *
   * @typedef {Object} message
   * @property {Object} notification
   *
   * @typedef {Object} notification
   * @property {string} title
   * @property {string} body
   */
  async sendAll(messages) {
    try {
      const response = await this.admin.messaging().sendAll(messages);
      return response;
    } catch (error) {
      await Promise.reject(error);
    }
  }

  /**
   * 대상지정하여 메세지 발송
   * @param {string} token
   * @param {string} message
   * @returns {MessagingTopicManagementResponse}
   * @throws {Promise<Error>}
   *
   * @typedef {Object} message
   * @property {Object} notification
   *
   * @typedef {Object} notification
   * @property {string} title
   * @property {string} body
   */
  async sendToTargets({ tokens, message }) {
    try {
      const response = await this.admin
        .messaging()
        .sendToDevice(tokens, message);
      return response;
    } catch (error) {
      await Promise.reject(error);
    }
  }
}

module.exports = new Firebase();
