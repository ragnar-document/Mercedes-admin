module.exports = function (req, res, next) {
    res.locals.seo = {
      title: 'Mercedes-admin',
      keywords: 'Mercedes-admin',
      description: 'Mercedes-admin'
    }
  
    next();
  }