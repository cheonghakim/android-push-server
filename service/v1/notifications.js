const AlarmModel = require("../../model/alarm");
const { db, getAsync, runAsync, getAllAsync } = require("../../plugins/mysql");

module.exports = class AlarmService {
  /**
   * 알림 가져오기
   * @returns {Promise<*>}
   * @throws {Promise<Error>}
   */
  static async getNotificationList() {
    try {
      const getSQL = `
       SELECT * from AlarmTbl ORDER BY created_date DESC;
      `;
      const countRows = await getAllAsync(getSQL);
      return countRows;
    } catch (err) {
      await Promise.reject(err);
    }
  }

  /**
   * 알림 대상 가져오기
   * @returns {Promise<*>}
   * @throws {Promise<Error>}
   */
  static async getAlarmTargets() {
    try {
      const getSQL = `
       SELECT user_id, token from UserTbl
       WHERE token IS NOT NULL;
      `;
      const targetRows = await getAllAsync(getSQL);
      return targetRows;
    } catch (err) {
      await Promise.reject(err);
    }
  }

  /**
   * 알림을 저장하는 비동기 메서드
   * @param {AlarmModel} alarmModel - 알림 모델 객체
   * @returns {Promise<Array>} - 쿼리 결과를 담은 Promise 배열
   * @throws {Promise<Error>} - 에러 객체
   *
   * @typedef {Object} AlarmModel - 알림 모델 객체
   * @property {string} title - 알림 제목
   * @property {string} content - 알림 내용
   */
  static async saveAlarm(alarmModel) {
    try {
      const { title, content } = alarmModel;
      const getSQL = `
       INSERT INTO AlarmTbl
       (created_date, title, content)
       VALUES (?, ?, ?); 
      `;
      const targetRows = await runAsync(getSQL, [
        `${new Date()}`,
        title,
        content,
      ]);
      return [targetRows];
    } catch (err) {
      await Promise.reject(err);
    }
  }
};
