const express = require('express')
const animetvn = require('../../engines/animetvn')

const animes = express.Router()

animes.get('/', (req, res, next) => {
  res.json({ version: '1.0.0', name: 'animes', source: 'animetvn.com' })
})

animes.get('/newest', (req, res, next) => {
  animetvn.newest(result => { res.json(result) })
})

animes.get('/detail/:id', (req, res, next) => {
  animetvn.detail(req.params.id, result => { res.json(result) })
})

animes.get('/media/:id', (req, res, next) => {
  animetvn.media(req.params.id, result => { res.json(result) })
})

module.exports = animes
