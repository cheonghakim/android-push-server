class MailModel {
  constructor(mailReceiver, newsList) {
    this._mailReceiver = mailReceiver
    this._newsList = newsList
  }

  get mailReceiver() {
    return this._mailReceiver
  }

  set mailReceiver(newData) {
    this._mailReceiver = newData
  }

  get newsList() {
    return this._newsList
  }

  set newsList(newData) {
    this._newsList = newData
  }
}

module.exports = new MailModel()
