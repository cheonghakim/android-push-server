// Session
const sess = {
  resave: true,
  saveUninitialized: true,
  secret: 'aflkq23a09wfcoijmnq2',
  name: 'sessionId',
  cookie: {
    httpOnly: true,
    secure: false,
  },
  // store: new SQLiteStore({
  //   db: db, // SQLite 데이터베이스 연결 객체 전달
  //   table: 'sessions', // 세션 테이블 이름 (기본값: 'sessions')
  // }),
}

module.exports = sess
