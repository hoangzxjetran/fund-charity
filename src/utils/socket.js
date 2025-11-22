const { Server } = require('socket.io')

let io = null

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: '*'
    }
  })

  io.on('connection', (socket) => {
    socket.on('join-notify', (userId) => {
      if (!userId) return
      socket.join(String(userId))
    })
    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id)
    })
  })
  return io
}

function getIO() {
  if (!io) throw new Error('Socket has not been initialized.')
  return io
}

module.exports = { initSocket, getIO }
