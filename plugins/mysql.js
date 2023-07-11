const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const util = require('util')
const dir = '../db/pushapp.db'

const poolConnection = new sqlite3.Database(
  path.resolve(__dirname, dir),
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.error(err.message)
    } else {
      console.log('Connected to the SQLite database.')
    }
  }
)

module.exports = {
  dir,
  db: poolConnection,
  runAsync: util.promisify(poolConnection.run).bind(poolConnection),
  getAsync: util.promisify(poolConnection.get).bind(poolConnection),
  getAllAsync: util.promisify(poolConnection.all).bind(poolConnection),
}
