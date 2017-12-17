// NOT WORKING YET BECAUSE IT USE CLONDFLARE!!!

const got = require('got')
const cheerio = require('cheerio')

const DOMAIN = 'http://animetvn.tv'
const DETAIL_PAGE = 'http://animetvn.tv/thong-tin-phim/f' // + id + '-xx-.html'
const MEDIA_PAGE = 'http://animetvn.tv/xem-phim/f' // + id + '-xx-.html'
const SEARCH_PAGE = 'http://animetvn.tv/tim-kiem/' // + key + '.html'
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2977.0 Safari/537.36'

// Option for got
const gotOptions = {
  headers: { 'user-agent': USER_AGENT, referer: DOMAIN },
  timeout: 3000,
  retries: 0
}

// Get list of newest
const newest = (callback) => {
  got(`${DOMAIN}/nhom/anime.html`, gotOptions).then(res => cheerio.load(res.body)).then($ => {
    //
    const objects = []
    $('.film-list > .item').map((i, e) => {
      const item = {}
      item.name = $(e).find('h3.title > a').text()
      item.url = $(e).find('h3.title > a').attr('href')
      item.id = item.url.split('thong-tin-phim/f')[1].split('-')[0]
      item.status = $(e).find('div.mode span.time').text()
      item.year = $(e).find('div.mode span.year').text()
      item.thumb = $(e).find('img').attr('data-src')
      item.description = $(e).find('div.tooltip_content').text()
      objects.push(item)
    })
    callback(objects)
  })
}

// Get detail
const detail = (urlOrId, callback) => {
  const isId = urlOrId.indexOf(DOMAIN) === -1
  const url = isId? DETAIL_PAGE + urlOrId + '-xxx-.html' : urlOrId

  got(url, gotOptions).then(res => cheerio.load(res.body)).then($ => {
    //
    const object = {}
    object.firstEp =  $('a.btn.play-now').attr('href')
    object.idFirstEp = object.firstEp.split('xem-phim/f')[1].split('-')[0]
    object.image =  $('img.big_img').attr('src')
    object.name =  $('h2.name-vi').text()
    object.nameEn =  $('h3.name-eng').text()
    object.info = $('ul.more-info').text()

    callback(object)
  })
}

// Find all media and link play current episode
const media = (urlOrId, callback) => {
  const isId = urlOrId.indexOf(DOMAIN) === -1
  const url = isId? MEDIA_PAGE + urlOrId + '-xxx-.html' : urlOrId

  got(url, gotOptions).then(res => cheerio.load(res.body)).then($ => {
    const object = {}
    object.source = findMediaOfBodyCode($('div.loadplayer').html())
    object.servers = []
    object.name = $('.main_page_title a').text().replace(/\n/g, '')
    $('ul.listep > .svep').map((i, e) => {
      const server = {}
      server.serverName = $(e).find('span.svname').text()
      server.episodes = []
      $(e).find('a.tapphim ').map((i, e) => {
        const episode = {}
        episode.id = $(e).attr('id').slice(3)
        episode.number = $(e).text()
        episode.url = $(e).attr('href')
        server.episodes.push(episode)
      })
      object.servers.push(server)
    })

    callback(object)
  })
  .catch(error => {
    callback({ error: error.toString() })
    console.log('whoop!. ' + error)
  })
}

// Searh
const search = (key, callback) => {
  const searchLink = SEARCH_PAGE + key + '.html'
  got(searchLink, gotOptions).then(res => cheerio.load(res.body)).then($ => {
    //
    const objects = []
    $('.film-list > .item').map((i, e) => {
      const item = {}
      item.name = $(e).find('h3.title > a').text()
      item.url = $(e).find('h3.title > a').attr('href')
      item.id = item.url.split('thong-tin-phim/f')[1].split('-')[0]
      item.status = $(e).find('div.mode span.time').text()
      item.year = $(e).find('div.mode span.year').text()
      item.thumb = $(e).find('img').attr('data-src')
      item.description = $(e).find('div.tooltip_content').text()
      objects.push(item)
    })
    callback(objects)
  })
}

// Find link play
function findMediaOfBodyCode(body) {
  if (body.indexOf('<iframe')) {
    const $ = cheerio.load(body)
    const url = $('iframe').attr('src')
    return { iframeSource: url }
  } else {
    return JSON.parse(result)
  }
}

module.exports = { newest, detail, media, search }
