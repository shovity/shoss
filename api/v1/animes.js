const express = require('express')
const animetvn = require('../../engines/animetvn')
const anivn = require('../../engines/anivn')

const animes = express.Router()

animes.get('/', (req, res, next) => {
  res.json({ version: '1.0.0', name: 'animes', source: 'anivn.com' })
})

animes.get('/newest', (req, res, next) => {
  anivn.newest(result => { res.json(result) })
})

animes.get('/detail/:id', (req, res, next) => {
  anivn.detail(req.params.id, result => { res.json(result) })
})

animes.get('/media/:id', (req, res, next) => {
  anivn.media(req.params.id, result => { res.json(result) })
})

module.exports = animes
