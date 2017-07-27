const logger = mode => (req, res, next) => {
  switch (mode) {
    case 'dev':
      console.log(`${req.method}:${req.url}`)
      return next()

    case 'product':
      return next()

    default:
      return next()
  }
}

module.exports = logger;
