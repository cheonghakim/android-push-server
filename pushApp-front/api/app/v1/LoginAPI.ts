import axios from 'axios'
import { LoginType } from '../types/LoginAPI'

export default class LoginAPI {
  static v1 = '/api/push/v1'

  static login({ userId, password }: LoginType) {
    const form = new FormData()
    form.append('user_id', userId)
    form.append('password', password)
    return axios.post(`${this.v1}/login/admin`, form)
  }
}
