const config = require('config');
const path = require('path');

const pathRewrite = path => path.replace(/\/api\/v\d\/\w+/, '');

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

const getZone = () => {
  const exporterMode = config.get('exporterMode');
  const zone = exporterMode === 'download' ? 'external' : 'internal';

  return zone;
};

module.exports = {
  getZone,
  pathRewrite,
  parseApiHost,
  parseWsHost,
  storeUrl,
};
