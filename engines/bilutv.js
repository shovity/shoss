const got = require('got')
const cheerio = require('cheerio')

const aes = require('./util/aes')

const DOMAIN = 'http://bilutv.com/'
const PHIM_LE = 'http://bilutv.com/danh-sach/phim-le.html'
const PHIM_BO = 'http://bilutv.com/danh-sach/phim-bo.html'
const MEDIA_PAGE = 'http://bilutv.com/xem-phim/phim-x-' // + id
const SEARCH_PAGE = 'http://bilutv.com/tim-kiem.html?q=' // + key
const DETAIL_PAGE = 'http://bilutv.com/phim/x-' // + key + '.html'

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2977.0 Safari/537.36'

// Option for got
const gotOptions = {
  headers: { 'user-agent': USER_AGENT, referer: DOMAIN },
  timeout: 3000,
  retries: 0
}

// decode url using the password
const decodeUrl = (url, modelId) => aes.dec(url, 'bilutv.com4590481877' + modelId)


// Get list of phimle
const phimLe = (callback) => {
  got(PHIM_LE, gotOptions).then(res => cheerio.load(res.body)).then($ => {
    //
    const objects = []
    $('.block-film .film-item').map((i, e) => {
      const item = {}
      item.name = $(e).find('.title > .name').text()
      item.realName = $(e).find('.title > .real-name').text()
      item.url = $(e).find('a').attr('href')
      item.id = item.url.match(/-([0-9]+).html$/)[1]
      item.status = $(e).find('.current-status').text()
      item.thumb = $(e).find('img').attr('data-original')
      objects.push(item)
    })
    callback(objects)
  })
}

// Get list of phimbo
const phimBo = (callback) => {
  got(PHIM_BO, gotOptions).then(res => cheerio.load(res.body)).then($ => {
    //
    const objects = []
    $('.block-film .film-item').map((i, e) => {
      const item = {}
      item.name = $(e).find('.title > .name').text()
      item.realName = $(e).find('.title > .real-name').text()
      item.url = $(e).find('a').attr('href')
      item.id = item.url.match(/-([0-9]+).html$/)[1]
      item.status = $(e).find('.current-status').text()
      item.thumb = $(e).find('img').attr('data-original')
      objects.push(item)
    })
    callback(objects)
  })
}

// Get list of phimle
const search = (key, callback) => {
  const url = SEARCH_PAGE + key
  got(url, gotOptions).then(res => cheerio.load(res.body)).then($ => {
    //
    const objects = []
    $('.block-film .film-item').map((i, e) => {
      const item = {}
      item.name = $(e).find('.title > .name').text()
      item.realName = $(e).find('.title > .real-name').text()
      item.url = $(e).find('a').attr('href')
      item.id = item.url.match(/-([0-9]+).html$/)[1]
      item.status = $(e).find('.current-status').text()
      item.thumb = $(e).find('img').attr('data-original')
      objects.push(item)
    })
    callback(objects)
  })
}

// Get detail
const detail = (urlOrId, callback) => {
  const isId = urlOrId.indexOf(DOMAIN) === -1
  const url = isId? DETAIL_PAGE + urlOrId + '.html' : urlOrId

  got(url, gotOptions).then(res => cheerio.load(res.body)).then($ => {
    //
    const object = {}
    object.firstEp =  $('.btn-see.btn.btn-danger').attr('href')
    object.idFirstEp = object.firstEp.match(/-([0-9]+)$/)[1]
    object.image =  $('.film-content img').attr('src')
    object.name =  $('.film-content h3').text().split(' - ')[0]
    object.nameEn =  $('.film-content h3').text().split(' - ')[1]
    object.info = $('.film-content p').text()

    callback(object)
  })
}


// Find all media and link play current episode
const media = (id, callback) => {
  const url = MEDIA_PAGE + id

  got(url, gotOptions).then(res => cheerio.load(res.body)).then($ => {
    const object = {}
    const dataSource = findMediaOfBodyCode($('div.left-content-player').html())
    const modelId = dataSource.modelId
    const source = dataSource.sourcesTm[0] // chon dai 1 source thoi, met lam
    const urlEncoded = source.links[0].file
    const url = decodeUrl(urlEncoded, modelId)

    object.source = {
      videoSource: [
        { url, label: source.label }
      ]
    }
    object.servers = [
      {
        serverName: 'Xem de:',
        episodes: [
          {id, number: 'co 1 tap thoi', url: 'khong quan tam'}
        ]
      }
    ]
    callback(object)
  })
  .catch(error => {
    callback({ error: error.toString() })
    console.log('whoop!. ' + error)
  })
}


const findMediaOfBodyCode = body => {
  var result = body.match(/var playerSetting = ({.+});/)
  result = JSON.parse(result[1])
  return result
}

module.exports = {
  phimLe, phimBo, search, media, detail
}
