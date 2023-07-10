const { db, getAsync, runAsync, getAllAsync } = require('../../plugins/mysql')

/**
 * 알림 가져오기
 * @returns {Promise<*>}
 */
async function getNotificationList() {
  try {
    const getSQL = `
       SELECT * from AlarmTbl;
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
async function getAlarmTargets() {
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
async function saveAlarm({ title, content }) {
  try {
    const getSQL = `
       INSERT INTO AlarmTbl
       (created_date, title, content)
       VALUES (?, ?, ?); 
      `
    const targetRows = await runAsync(getSQL, [`${new Date()}`, title, content])
    return [targetRows]
  } catch (err) {
    await Promise.reject(err)
  }
}

module.exports = {
  getNotificationList,
  getAlarmTargets,
  saveAlarm,
}
