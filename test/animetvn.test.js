const assert = require('assert')
const animetvn = require('../engines/animetvn')

describe('Anime TVN', function() {
  it('Get newest animes', done => {
    animetvn.newest(result => {
      if (result.length > 0) {
        done()
      } else {
        done(new Error('Get index worng!'))
      }
    })
  })

  it('Get media anime id 117420', done => {
    animetvn.media('117420', result => {
      if(result.servers.length > 0 && result.sources.length > 0) {
        done()
      } else (
        done(new Error('Get media worng!'))
      )
    })
  })

  it('Get detail anime id 3691', done => {
    animetvn.detail('3691', result => {
      if(result.firstEp.length > 0 && result.name.length > 0) {
        done()
      } else (
        done(new Error('Get deatil worng!'))
      )
    })
  })
})
