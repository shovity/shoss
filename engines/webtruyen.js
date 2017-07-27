const got = require('got')
const cheerio = require('cheerio')

const DOMAIN = 'http://webtruyen.com'
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2977.0 Safari/537.36'

// Option for got
const gotOptions = {
  headers: { 'user-agent': USER_AGENT, referer: DOMAIN },
  timeout: 3000,
  retries: 0
}

const newest = callback => {
  got(`${DOMAIN}/searching/all/dateup/all/tien-hiep/`, gotOptions).then(res => cheerio.load(res.body)).then($ => {
    //
    const objects = []
    $('.w3-row.list-content > .w3-col').map((i, e) => {
      const item = {}
      item.name = $(e).find('a.w3-hover-opacity').attr('title')
      item.url = $(e).find('a.w3-hover-opacity').attr('href')
      item.id = item.url.split('ruyen.com/')[1].slice(0, -1)
      item.image = $(e).find('img').attr('src')
      item.view = $('.caption-view').html().split('> ')[1]
      objects.push(item)
    })
    callback(objects)
  })
}

const detail = (id, callback) => {
  const url = DOMAIN + '/' + id
  got(url, gotOptions).then(res => cheerio.load(res.body)).then($ => {
    //
    const object = {}
    object.name =  $('.detail-right > h1 > a').text()
    object.id = id
    object.image =  $('.detail-thumbnail img').attr('src')
    object.description =  $('.w3-justify.summary').text()
    object.info =  $('.detail-info').text()

    object.chapters = []
    $('#divtab .w3-ul li').map((i, e) => {
      const chapter = {}
      chapter.name = $(e).find('h4 a').text()
      chapter.url = $(e).find('h4 a').attr('href')
      chapter.id = chapter.url.split('_')[1].split('.')[0]
      chapter.date = $(e).find('span').text()
      object.chapters.push(chapter)
    })
    callback(object)
  })
}

const content = (storyId, chapterId, callback) => {
  const url = `${DOMAIN}/${storyId}/xxx_${chapterId}.html`
  got(url, gotOptions).then(res => cheerio.load(res.body)).then($ => {
    const object = {}
    object.content = $('#content').text()
    object.nextId = $('#nextchap').attr('href').split('_')[1].split('.')[0]
    object.prevId = $('#prevchap').attr('href').split('_')[1].split('.')[0]
    callback(object)
  })
}

module.exports = {
  newest,
  detail,
  content
}
