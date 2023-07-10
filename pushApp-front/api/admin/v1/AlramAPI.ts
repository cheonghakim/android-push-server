import axios from 'axios'
import { dataType } from '../types/AlarmType'
export default class AlarmAPI {
  static v1: string = '/api/push/v1'

  static getAlarmList() {
    return axios.get(`${this.v1}/notifications`)
  }

  static sendAlarm({ title, body, targets }: dataType) {
    const form = new FormData()
    form.append('title', title)
    form.append('body', body)
    form.append('targets', JSON.stringify(targets))
    return axios.post(`${this.v1}/notifications`)
  }
}
