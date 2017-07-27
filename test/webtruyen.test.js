const assert = require('assert')
const webtruyen = require('../engines/webtruyen')

describe('Web Truyen', function() {
  it('Get newest story', done => {
    webtruyen.newest(result => {
      if (result.length > 0) {
        done()
      } else {
        done(new Error('Get index worng!'))
      }
    })
  })

  it('Get detail story of id \'khi-tien-lo\'', done => {
    webtruyen.detail('khi-tien-lo', result => {
      if(result.name.length > 0) {
        done()
      } else (
        done(new Error('Get detail worng!'))
      )
    })
  })

  it('Get content of storyId=\'khi-tien-lo\' chapterId=\'1184037\'', done => {
    webtruyen.content('khi-tien-lo', 1184037, result => {
      if(result.content.length) {
        done()
      } else (
        done(new Error('Get content worng!'))
      )
    })
  })
})
