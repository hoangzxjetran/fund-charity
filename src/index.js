const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')
const route = require('./routes/index.js')
const { connectDB } = require('./config/connectDB.js')
const errorMiddleware = require('./middlewares/error.middlewares.js')
dotenv.config()
const app = express()
app.use(
  cors({
    origin: '*'
  })
)
const port = process.env.PORT || 5000
app.use(express.json())

route(app)
connectDB()
app.use(errorMiddleware)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
