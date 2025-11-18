const http = require('http')
const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')
const route = require('./routes/index.js')
const { connectDB } = require('./config/connectDB.js')
const errorMiddleware = require('./middlewares/error.middlewares.js')
const { initSocket } = require('./utils/socket.js')

dotenv.config()
const app = express()

app.use(
  cors({
    origin: '*'
  })
)
app.use(express.json())

const httpServer = http.createServer(app)

const io = initSocket(httpServer)

route(app)
connectDB()
app.use(errorMiddleware)

const port = process.env.PORT || 5000
httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
