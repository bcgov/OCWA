const config = require('config');
const express = require('express');
const get = require('lodash/get');
const has = require('lodash/has');
const Minio = require('minio');
const _async = require('async');
const request = require('request-promise');

const router = express.Router();
const minioClient = new Minio.Client({
  endPoint: config.get('storage.endPoint'),
  port: config.get('storage.port'),
  useSSL: config.get('storage.useSSL'),
  accessKey: config.get('storage.accessKey'),
  secretKey: config.get('storage.secretKey'),
});
const bucket = config.get('storage.bucket');

const NodeCache = require( "node-cache" );
const cache = new NodeCache({deleteOnExpire: true});

// Ensure the user is logged in before sending any files and ensure the request
// has the file they want
const authenticateRequest = (req, res, done) => {
  if (!req.user || !req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).end();
  }
  const requestId = get(req, 'query.request_id');

  if (!requestId) {
    return res
      .status(500)
      .send({ message: 'No request is attached to these files' })
      .end();
  }

  done();
};

// Checks the request before allowing access to the file.
// @returns { Boolean | Error }
const validateFileRequest = async (req, requestId) => {
  const requestApiHost = config.get('requestApiHost');
  const token = req.headers.authorization || `Bearer ${req.user.accessToken}`;

  try {
    const r = await request.get({
      url: `${requestApiHost}/v2/${requestId}?include_file_status=false`,
      headers: {
        Authorization: token,
      },
    });
    const json = JSON.parse(r);

    // NOTE: The request will only be returned if the user has the 
    // right role, is in the right zone and the request is in the right status

    // For when there are requests for a list of files
    if (has(req, 'query.ids')) {
      if (req.query.ids.split(',').every(id => json.files.includes(id) || json.supportingFiles.includes(id))) {
        return true;
      }
    }

    // For downloading a file
    if (has(req, 'params.fileId')) {
      if (json.files.includes(req.params.fileId) || json.supportingFiles.includes(req.params.fileId)) {
        return true;
      }
    }
    // if we get this far we have to assume there is a mismatch and prevent access
    return new Error('Files unavailable');
  } catch (err) {
    return err;
  }
};

async function fetchIds(ids) {
    const CACHE_TIME = 60*60*24*7; // 7 day cache
    return _async.mapLimit(ids, 10, async (id) => {
        if (!cache.has(id)) {
            const { metaData } = await minioClient.statObject(bucket, id);
            const { jwt, ...file } = metaData;
            cache.set(id, { id, ...file }, CACHE_TIME);
        }
        return cache.get(id);
    });
}

router.get('/', authenticateRequest, async (req, res, next) => {
  const requestId = get(req, 'query.request_id');
  const ids = req.query.ids.split(',');

  try {
    const isFileValid = await validateFileRequest(req, requestId);

    if (isFileValid === true) {
      const files = await fetchIds(ids);
      return res.json(files);
    } else {
      throw new Error(isFileValid);
    }
  } catch (err) {
    return res
      .status(401)
      .send({ message: err.message })
      .end();
  }
});

router.get('/:fileId', authenticateRequest, async (req, res) => {
  const { fileId } = req.params;
  const requestId = get(req, 'query.request_id');
  const isFileValid = await validateFileRequest(req, requestId);

  if (isFileValid === true) {
    const { metaData } = await minioClient.statObject(bucket, fileId);
    const stream = await minioClient.getObject(bucket, fileId);
    const data = [];

    stream.on('data', chunk => data.push(chunk));
    stream.on('end', () => {
      const fileData = Buffer.concat(data);

      res.writeHead(200, {
        'Content-Type': metaData.filetype || metaData['content-type'],
        'Content-Disposition': `attachment; filename=${metaData.filename}`,
        'Content-Length': fileData.length,
      });

      res.end(fileData);
    });
  } else {
    return res
      .status(401)
      .send(get(isFileValid, 'message', 'File Unavailable'))
      .end();
  }
});

module.exports = router;
