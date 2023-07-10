import axios from 'axios'
export default class CommonAPI {
  static v1: string = '/api/push/v1'

  static getUserList() {
    return axios.get(`${this.v1}/common/user-list`)
  }
}
