const path = require('path');

const pathRewrite = path => path.replace(/\/api\/v1\/\w+/, '');

const parseApiHost = url => {
  if (!/https?:\/\//.test(url)) {
    return `http://${url}`;
  }

  return url;
};

const parseWsHost = url => {
  if (!/wss?:\/\//.test(url)) {
    return `ws://${url}`;
  }

  return url;
};

// Middleware to store a URL when unauthenticated so you can be returned to it
// after sign in is completed
const storeUrl = (req, res, done) => {
  if (!req.user || !req.isAuthenticated || !req.isAuthenticated()) {
    const { originalUrl } = req;
    const testForExt = path.extname(originalUrl);

    if (testForExt.length < 1) {
      req.session.redirectTo = req.originalUrl;
    }
  }

  done();
};

module.exports = {
  pathRewrite,
  parseApiHost,
  parseWsHost,
  storeUrl,
};
