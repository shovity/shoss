const express = require('express')
const webtruyen = require('../../engines/webtruyen')

const storys = express.Router()

storys.get('/', (req, res, next) => {
  res.json({ version: '1.0.0', name: 'storys', source: 'webtruyen.com' })
})

storys.get('/newest', (req, res, next) => {
  webtruyen.newest(result => { res.json(result) })
})

storys.get('/detail/:id', (req, res, next) => {
  webtruyen.detail(req.params.id, result => { res.json(result) })
})

storys.get('/content/:storyId/:chapterId', (req, res, next) => {
  webtruyen.content(req.params.storyId, req.params.chapterId, result => { res.json(result) })
})

module.exports = storys
