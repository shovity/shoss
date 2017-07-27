const express = require('express')

const animes = require('./animes')
const storys = require('./storys')

const v1 = express.Router()

v1.get('/', (req, res, next) => {
  res.json({
    version: '1.0.0'
  })
})

v1.use('/animes', animes)
v1.use('/storys', storys)

module.exports = v1
