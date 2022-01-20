const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const userRouter = require('./routers/userRouter')
const spotifyRouter = require('./routers/spotifyRouter')

dotenv.config()
const port = process.env.PORT

const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/api/user', userRouter)
app.use('/api/spotify', spotifyRouter)

app.get('/', (req, res) => {
  res.send('The server is listing')
})

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

app.listen(port, () => {
  console.log('The server is running in port ' + port)
})
