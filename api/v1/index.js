const express = require('express')

const animes = require('./animes')
const storys = require('./storys')
const animetvn = require('../../engines/animetvn')

const v1 = express.Router()

v1.get('/', (req, res, next) => {
  res.json({
    what: 'Super api :D',
    version: '1.0.0'
  })
})

v1.get('/movie/search/:key', (req, res, next) => {
  animetvn.search(req.params.key, result => { res.json(result) })
})

v1.use('/animes', animes)
v1.use('/storys', storys)

module.exports = v1
