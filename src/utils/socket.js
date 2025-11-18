const { Server } = require('socket.io')
let io = null

function initSocket(server) {
  io = new Server(server, { cors: { origin: '*' } })
  io.on('connection', (socket) => {
    socket.on('join', (userId) => {
      if (userId) socket.join(String(userId))
    })
    socket.on('join_admin', () => socket.join('admin_room'))
    socket.on('join_campaign', (ownerId) => {
      if (ownerId) socket.join(String(ownerId))
    })
  })
  return io
}

function getIO() {
  if (!io) throw new Error('Socket not initialized')
  return io
}

module.exports = { initSocket, getIO }
