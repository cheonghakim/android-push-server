class RssModel {
  constructor({ link }) {
    this._link = link
  }

  get link() {
    return this._link
  }

  set link(newData) {
    this._link = newData
  }
}

module.exports = RssModel
