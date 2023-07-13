class FeedModel {
  constructor({ title, link, createdDate }) {
    this._title = title;
    this._link = link;
    this._createdDate = createdDate;
  }

  get title() {
    return this._title;
  }

  set title(newData) {
    this._title = newData;
  }

  get link() {
    return this._link;
  }

  set link(newData) {
    this._link = newData;
  }

  get createdDate() {
    return this._createdDate;
  }

  set createdDate(newData) {
    this._createdDate = newData;
  }
}

module.exports = FeedModel;
