import { all, call, fork, put, take } from 'redux-saga/effects';
import { channel, delay, eventChannel, END } from 'redux-saga';
import { getToken } from '@src/services/auth';
import difference from 'lodash/difference';
import head from 'lodash/head';
import { normalize } from 'normalizr';
import tus from 'tus-js-client';

import { fileSchema } from './schemas';
import {
  uploadFileFailure,
  uploadFileProgress,
  uploadFileSuccess,
  uploadFileReset,
} from './actions';

export const sanitizeURL = url => {
  if (url) {
    const fileUploadIdHash = url.replace(/https?:\/\/.*\/files\//, '');
    const fileUploadId = head(fileUploadIdHash.split('+'));
    return fileUploadId;
  }

  return '';
};

export const syncFilesPayload = (files, filesToDelete) =>
  difference(files, filesToDelete);

// Channel to handle the file uploads with TUS
// file: File object
// metadata: composed details, includes filename, filetype, lastModified and jwt
function uploadChannel(file, metadata) {
  return eventChannel(emitter => {
    const upload = new tus.Upload(file, {
      endpoint: `${FILES_API_HOST}/files/`,
      retryDelays: [0, 1000, 3000, 5000],
      chunkSize: 52000000,
      metadata,
      onError: error =>
        emitter({
          error,
          file,
          id: sanitizeURL(upload.url),
        }),
      onProgress: (bytesUploaded, bytesTotal) =>
        emitter({
          file,
          progress: bytesUploaded / bytesTotal * 100,
          id: sanitizeURL(upload.url),
        }),
      onSuccess: () => {
        emitter({
          file,
          success: true,
          id: sanitizeURL(upload.url),
        });
        emitter(END);
      },
    });

    upload.start();

    return () => upload.abort();
  });
}

// Upload Saga
function* uploadFileChannel(item, meta) {
  const token = getToken();
  const file = {
    fileName: item.name,
    fileType: item.type,
    lastModified: item.lastModified,
    size: item.size,
  };
  const metaData = {
    ...file,
    jwt: token,
  };
  // Create the channel with the file and the metadata
  const chan = yield call(uploadChannel, item, metaData);

  while (true) {
    // File upload states from TUS, the file is from the upload above
    const { error, progress = 0, success, id } = yield take(chan);
    const payload = {
      ...file,
      id,
      progress,
    };

    if (error) {
      yield put(uploadFileFailure({ ...meta, file: payload }, error));
      yield call(delay, 5000);
      yield put(uploadFileReset());
      return;
    }

    if (success) {
      yield put(uploadFileSuccess({ ...meta, file: payload }, payload));
      // Workaround to update the internal data store
      yield put({
        type: 'files/get/success',
        meta: {
          ...meta,
          dataType: 'files',
        },
        payload: normalize(payload, fileSchema),
      });
      // Autosave the request
      yield call(delay, 1500);
      yield put(uploadFileReset(payload.id));
      return;
    }

    yield put(uploadFileProgress({ ...meta, file: payload }, progress));
  }
}

// Responsible for forking the worker threads to the uploadFile channel
function* uploadDispatcher(chan) {
  while (true) {
    const { payload, meta } = yield take(chan);
    yield call(uploadFileChannel, payload, meta);
  }
}

// This saga is responsible for setting up the worker threads for uploading
// before setting up a watcher for the upload action
function* uploadFileWatcher() {
  const chan = yield call(channel);

  for (let i = 0; i < 3; i += 1) {
    yield fork(uploadDispatcher, chan);
  }

  while (true) {
    const { meta, payload } = yield take('request/file/upload');
    // The upload action sends an array (not FileList) of Files
    yield all(payload.map(file => put(chan, { payload: file, meta })));
  }
}

export default function* root() {
  yield call(uploadFileWatcher);
}
