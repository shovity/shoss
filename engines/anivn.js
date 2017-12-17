const got = require('got')
const cheerio = require('cheerio')
const request = require('request')

const DOMAIN = 'http://www.anivn.com/'
const DETAIL_PAGE = 'http://www.anivn.com/thong-tin-phim/x/' // + id + '.html'
const MEDIA_PAGE = 'http://www.anivn.com/xem-phim/' // + '/x/' + id + '.html'
const SEARCH_PAGE = 'http://www.anivn.com/tim-kiem/' // + key + '.html'
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2977.0 Safari/537.36'

// Option for got
const gotOptions = {
  headers: { 'user-agent': USER_AGENT, referer: DOMAIN },
  timeout: 3000,
  retries: 0
}

// Headre for request
const requestHeaders = {
  'User-Agent': USER_AGENT,
  'Content-Type': 'application/x-www-form-urlencoded'
}

// Test get content
const test = () => {
  got(DOMAIN, gotOptions).then(res => cheerio.load(res.body)).then($ => {
    console.log($.html())
  })
}

// Get list of newest
const newest = (callback) => {
  got(`${DOMAIN}/danh-sach/anime-it-tap`, gotOptions).then(res => cheerio.load(res.body)).then($ => {
    //
    const objects = []
    $('.post > .widget-post').map((i, e) => {
      const item = {}
      item.name = $(e).find('.tenphim-hinhanh h2').text()
      item.url = $(e).find('.tenphim-hinhanh > a').attr('href')
      item.id = item.url.split('/').slice(-1)[0].split('.')[0]
      item.status = $(e).find('.status').text()
      item.thumb = $(e).find('img').attr('src')
      item.description = $(e).find('.TooltipContent > p').text()
      objects.push(item)
    })
    callback(objects)
  })
}

// Get detail
const detail = (id, callback) => {
  const url = DETAIL_PAGE + id + '.html';

  got(url, gotOptions).then(res => cheerio.load(res.body)).then($ => {
    //
    const object = {}
    object.firstEp =  $('.btn-cms.btn-red').attr('href')
    object.idFirstEp = object.firstEp.split('/').slice(-1)[0].split('.')[0]
    object.image =  $('.post-thumb').attr('src')
    object.name =  $('.mvtitle').text()
    object.nameEn =  $('.mvtitle').text()
    object.info = $('.movie-info').text()

    callback(object)
  })
}

// Find all media and link play current episode
const media = (id, callback) => {
  const url = MEDIA_PAGE + '/x/' + id + '.html';

  getMediaSources(id, (source) => {
    //
    got(url, gotOptions).then(res => cheerio.load(res.body)).then($ => {
      //
      const object = {}
      object.source = { source, iframeSource: source}
      object.servers = []

      object.name = $('.section-title').text().match(/Bình Luận Anime (.+)Bạn Đã Xem Chưa \?/)[1]

      $('.serverlist .movie-part').map((i, e) => {
        const server = {}
        server.serverName = $(e).find('.server').text()
        server.episodes = []
        $(e).find('a.ep ').map((i, e) => {
          const episode = {}
          episode.number = $(e).text()
          episode.id = $(e).attr('href').split('/').slice(-1)[0].split('.')[0]
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
  })
}

// Searh
const search = (key, callback) => {
  const searchLink = SEARCH_PAGE + key + '.html'
  got(searchLink, gotOptions).then(res => cheerio.load(res.body)).then($ => {
    //
    const objects = []
    $('.post > .widget-post').map((i, e) => {
      const item = {}
      item.name = $(e).find('.tenphim-hinhanh h2').text()
      item.url = $(e).find('.tenphim-hinhanh > a').attr('href')
      item.id = item.url.split('/').slice(-1)[0].split('.')[0]
      item.status = $(e).find('.status').text()
      item.thumb = $(e).find('img').attr('src')
      item.description = $(e).find('.TooltipContent > p').text()
      objects.push(item)
    })
    callback(objects)
  })
}

// Find link play
function getMediaSources(id, cb) {
  const options = {
    url: 'http://www.anivn.com/ajaxanime.php',
    method: 'POST',
    headers: requestHeaders,
    form: {'anivnid': id }
  }

  request(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const resultRegex = body.match(/\,sources\: \[\{file\: \"(.+)\"\,label\: \"AnimeVN\"/) || [null, null]
      const source = resultRegex[1]
      cb(source)
    } else {
      console.log(response.statusCode, error)
      cb(null )
    }
  })
}

search('one piece', (data) => {
  console.log(data)
})

module.exports = { newest, detail, media, search }