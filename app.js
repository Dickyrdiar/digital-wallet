const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

const app = express(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// call router function
require('./router/routes.js')(app)

// mongodb connection
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true
}).then(() => {
  console.log('db connect')
}).catch(err => {
  console.log('connection failed', err)
})

app.listen(3001, () => {
  console.log('server running')
})
