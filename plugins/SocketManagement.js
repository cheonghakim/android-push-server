class SocketManagement {
  constructor() {
    this.clients = []
  }

  // 소켓 등록
  setSocket(socket) {
    this.clients.push({
      socket: socket,
    })
  }

  // 소켓 제거
  deleteSocket(socket) {
    for (let i in this.clients) {
      if (socket.id === this.clients[i].socket.id) {
        this.clients.splice(i, 1)
        break
      }
    }
  }

  // 데이터 전송
  send({ log }) {
    for (const client of this.clients) {
      client.socket.emit('crawling', {
        log: log,
      })
    }
  }

  // 정지 알림 전송
  stop() {
    for (const client of this.clients) {
      client.socket.emit('crawlingStop')
    }
  }
}

module.exports = new SocketManagement()
