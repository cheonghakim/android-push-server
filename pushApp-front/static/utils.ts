export default class Utils {
  /**
   * http get 쿼리 스트링 생성
   * @param {object} - obj
   * @param {boolean} - emptyStr
   * @returns {string}
   */
  static queryString(obj: any, emptyStr = false) {
    const query: string[] = []
    Object.keys(obj).forEach((key) => {
      const value = obj[key]
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach((v) => {
            query.push(`${key}=${encodeURIComponent(v)}`)
          })
        } else {
          query.push(`${key}=${encodeURIComponent(value)}`)
        }
      } else if (value !== undefined && value !== null && emptyStr) {
        if (Array.isArray(value)) {
          value.forEach((v) => {
            query.push(`${key}=${encodeURIComponent(v)}`)
          })
        } else {
          query.push(`${key}=${encodeURIComponent(value)}`)
        }
      }
    })
    return `?${query.join('&')}`
  }

  /**
   * 빈값인지 확인
   * @param {string|number|object|array|null|undefined} val
   * @returns {boolean}
   */
  static isEmpty(val: any) {
    if (
      val === null ||
      val === undefined ||
      val === 'undefined' ||
      val === 'null' ||
      val === '' ||
      (typeof val === 'string' && val?.trim() === '') ||
      (Array.isArray(val) && val.length === 0)
    )
      return true
    return false
  }
}
