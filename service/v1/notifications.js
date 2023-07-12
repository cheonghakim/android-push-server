const { db, getAsync, runAsync, getAllAsync } = require('../../plugins/mysql')

module.exports = class AlarmService {
  /**
   * 알림 가져오기
   * @returns {Promise<*>}
   */
  static async getNotificationList() {
    try {
      const getSQL = `
       SELECT * from AlarmTbl ORDER BY created_date DESC;
      `
      const countRows = await getAllAsync(getSQL)
      return countRows
    } catch (err) {
      await Promise.reject(err)
    }
  }

  /**
   * 알림 대상 가져오기
   * @returns {Promise<*>}
   */
  static async getAlarmTargets() {
    try {
      const getSQL = `
       SELECT user_id, token from UserTbl
       WHERE token IS NOT NULL;
      `
      const targetRows = await getAllAsync(getSQL)
      return targetRows
    } catch (err) {
      await Promise.reject(err)
    }
  }

  /**
   * 알림 저장하기
   * @returns {Promise<*>}
   */
  static async saveAlarm(alarmModel) {
    try {
      const { title, content } = alarmModel
      const getSQL = `
       INSERT INTO AlarmTbl
       (created_date, title, content)
       VALUES (?, ?, ?); 
      `
      const targetRows = await runAsync(getSQL, [
        `${new Date()}`,
        title,
        content,
      ])
      return [targetRows]
    } catch (err) {
      await Promise.reject(err)
    }
  }
}
