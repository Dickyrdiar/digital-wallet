const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
// const session = require('express-session')
const cors = require('cors')
require('dotenv').config()

const app = express(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.session({
  secret: 'Stays my secret',
  cookie: {
    maxAge: new Date(Date.now() + 3600000),
    expires: new Date(Date.now() + 3600000)
  }
  // store: new MongoStore({ db: 'MyDB' })
}))

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
