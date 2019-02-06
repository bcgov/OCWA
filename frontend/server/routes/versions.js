const config = require('config');
const express = require('express');
const request = require('request');
const { parseApiHost } = require('../utils');

const router = express.Router();

const forumApiHost = config.get('forumApiHost');
const requestApiHost = config.get('requestApiHost');

function versionRequest(url) {
  return new Promise((resolve, reject) => {
    request.get(`${parseApiHost(url)}/version`, (err, resp, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(body));
      }
    });
  });
}

router.get('/', (req, res) => {
  Promise.all([versionRequest(forumApiHost), versionRequest(requestApiHost)])
    .then(json =>
      res.json({
        versions: json,
      })
    )
    .catch(err => {
      res.status(500);
      res.json({
        error: err.message,
      });
    });
});

module.exports = router;
