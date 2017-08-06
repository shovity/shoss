const express = require('express')
const bilutv = require('../../engines/bilutv')

const animes = express.Router()

animes.get('/', (req, res, next) => {
  res.json({ version: '1.0.0', name: 'movie, phimle, phimbo', source: 'bilutv' })
})

animes.get('/phimle', (req, res, next) => {
  bilutv.phimLe(result => { res.json(result) })
})

animes.get('/phimbo', (req, res, next) => {
  bilutv.phimBo(result => { res.json(result) })
})

animes.get('/detail/:id', (req, res, next) => {
  bilutv.detail(req.params.id, result => { res.json(result) })
})

animes.get('/media/:id', (req, res, next) => {
  bilutv.media(req.params.id, result => { res.json(result) })
})

module.exports = animes
