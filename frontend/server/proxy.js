const config = require('config');
const isEmpty = require('lodash/isEmpty');
const proxy = require('http-proxy-middleware');

const { pathRewrite, parseApiHost, parseWsHost } = require('./utils');

// Proxy config
const forumApiHost = config.get('forumApiHost');
const forumSocket = config.get('forumSocket');
const requestApiHost = config.get('requestApiHost');

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
  target: parseApiHost(`${forumApiHost}/v1`),
  onProxyReq,
  pathRewrite,
});

const forumSocketProxy = proxy({
  target: parseWsHost(forumSocket),
  ws: true,
});

const requestProxy = proxy({
  target: parseApiHost(`${requestApiHost}/v2`),
  onProxyReq,
  pathRewrite,
});

module.exports = {
  forum: forumProxy,
  forumSocket: forumSocketProxy,
  request: requestProxy,
};
