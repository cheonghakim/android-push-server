const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const util = require('util')

class Database {
  static dir = '../db/pushapp.db'
  constructor() {
    this.poolConnection = new sqlite3.Database(
      path.resolve(__dirname, Database.dir),
      sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) {
          console.error(err.message)
        } else {
          console.log('Connected to the SQLite database.')
        }
      }
    )
  }
}

const db = new Database()

module.exports = {
  dir: Database.dir,
  db: db.poolConnection,
  runAsync: util.promisify(db.poolConnection.run).bind(db.poolConnection),
  getAsync: util.promisify(db.poolConnection.get).bind(db.poolConnection),
  getAllAsync: util.promisify(db.poolConnection.all).bind(db.poolConnection),
}
