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
    try {
      const { metaData } = await minioClient.statObject(bucket, id);
      const { jwt, ...file } = metaData;
      result.push({ id, ...file });
    } catch (err) {
      console.log('files break', err);
    }
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

router.get('/:fileId', async (req, res) => {
  const { fileId } = req.params;
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
});

module.exports = router;
