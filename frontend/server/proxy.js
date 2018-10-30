const config = require('config');
const isEmpty = require('lodash/isEmpty');
const proxy = require('http-proxy-middleware');

// Proxy config
const forumApiHost = config.get('forumApiHost');
const forumSocket = config.get('forumSocket');
const requestApiHost = config.get('requestApiHost');

const pathRewrite = (path, req) => path.replace(/\/api\/v1\/\w+/, '');

// Need to doctor the proxy request due to some issues with body-parser.
const onProxyReq = (proxyReq, req) => {
  const contentType = proxyReq.getHeader('Content-Type');
  let bodyData;

  if (isEmpty(req.body) || !Object.keys(req.body).length) {
    return;
  }

  if (contentType === 'application/json') {
    bodyData = JSON.stringify(req.body);
  }

  if (bodyData) {
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
  }
};

const forumProxy = proxy({
  target: `http://${forumApiHost}/v1`,
  onProxyReq,
  pathRewrite,
});

const forumSocketProxy = proxy({
  target: `ws://${forumSocket}`,
  ws: true,
});

const requestProxy = proxy({
  target: `http://${requestApiHost}/v1`,
  onProxyReq,
  pathRewrite,
});

module.exports = {
  forum: forumProxy,
  forumSocket: forumSocketProxy,
  request: requestProxy,
};
