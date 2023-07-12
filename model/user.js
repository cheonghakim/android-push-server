class UserModel {
  constructor({ userId, password, passwordCheck, token, updatedDate }) {
    this._userId = userId
    this._password = password
    this._passwordCheck = passwordCheck
    this._token = token
    this._updatedDate = updatedDate
  }

  get userId() {
    return this._userId
  }

  set userId(newData) {
    this._userId = newData
  }

  get password() {
    return this._password
  }

  set password(newData) {
    this._password = newData
  }

  get passwordCheck() {
    return this._passwordCheck
  }

  set passwordCheck(newData) {
    this._passwordCheck = newData
  }

  get token() {
    return _token
  }

  set token(newData) {
    this._token = newData
  }

  get updatedDate() {
    return _updatedDate
  }

  set updatedDate(newData) {
    this._updatedDate = newData
  }
}

module.exports = UserModel
