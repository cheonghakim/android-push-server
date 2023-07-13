class AlarmModel {
  constructor({ title, content, createdDate }) {
    this._title = title;
    this._content = content;
    this._createdDate = createdDate;
  }

  get title() {
    return this._title;
  }

  set title(newData) {
    this._title = newData;
  }

  get content() {
    return this._content;
  }

  set content(newData) {
    this._content = newData;
  }

  get createdDate() {
    return this._createdDate;
  }

  set createdDate(newData) {
    this._createdDate = newData;
  }
}

module.exports = AlarmModel;
