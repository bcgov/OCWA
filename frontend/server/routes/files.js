const config = require('config');
const express = require('express');
const Minio = require('minio');

const router = express.Router();
const minioClient = new Minio.Client({
  endPoint: config.get('storage.endPoint'),
  port: config.get('storage.port'),
  useSSL: config.get('storage.useSSL'),
  accessKey: config.get('storage.accessKey'),
  secretKey: config.get('storage.secretKey'),
});
const bucket = config.get('storage.bucket');

async function fetchIds(ids) {
  const result = [];
  for (const id of ids) {
    const { metaData } = await minioClient.statObject(bucket, id);
    const { jwt, ...file } = metaData;
    result.push({ id, ...file });
  }

  return result;
}

router.get('/', async (req, res, next) => {
  const ids = req.query.ids.split(',');

  try {
    const files = await fetchIds(ids);

    return res.json(files);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
