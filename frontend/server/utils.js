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

module.exports = {
  pathRewrite,
  parseApiHost,
  parseWsHost,
};
