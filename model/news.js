class NewsModel {
  constructor({ title, content, link, createdDate, feedId, author }) {
    this._title = title
    this._content = content
    this._link = link
    this._createdDate = createdDate
    this._feedId = feedId
    this._author = author
  }

  get title() {
    return this._title
  }

  set title(newData) {
    this._title = newData
  }

  get content() {
    return this._content
  }

  set content(newData) {
    this._content = newData
  }

  get link() {
    return this._link
  }

  set link(newData) {
    this._link = newData
  }

  get createdDate() {
    return this._createdDate
  }

  set createdDate(newData) {
    this._createdDate = newData
  }

  get feedId() {
    return this._feedId
  }

  set feedId(newData) {
    this._feedId = newData
  }

  get author() {
    return this._author
  }

  set author(newData) {
    this._author = newData
  }
}

module.exports = NewsModel
