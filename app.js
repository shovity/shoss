const http = express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const logger = require('./middlewares/logger')
const apiV1 = require('./api/v1')

const app = express()

app.use(cors())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(logger('dev'))

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res, next) => {
  res.json({
    what: 'This is coolest webservice',
    version: '1.0.0'
  })
})

app.use('/api/v1', apiV1)

module.exports = app
