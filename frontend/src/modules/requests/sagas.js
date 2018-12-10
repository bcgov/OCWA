import { all, call, fork, put, take } from 'redux-saga/effects';
import { channel, delay, eventChannel, END } from 'redux-saga';
import { getToken } from '@src/services/auth';
import head from 'lodash/head';
import tus from 'tus-js-client';

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

// Channel to handle the file uploads with TUS
// file: File object
// metadata: composed details, includes filename, filetype, lastModified and jwt
function uploadChannel(file, metadata) {
  return eventChannel(emitter => {
    const upload = new tus.Upload(file, {
      endpoint: `${FILES_API_HOST}/files/`,
      retryDelays: [0, 1000, 3000, 5000],
      metadata,
      onError: error =>
        emitter({
          error,
          file,
          url: sanitizeURL(upload.url),
        }),
      onProgress: (bytesUploaded, bytesTotal) =>
        emitter({
          file,
          progress: bytesUploaded / bytesTotal * 100,
          url: sanitizeURL(upload.url),
        }),
      onSuccess: () => {
        emitter({
          file,
          success: true,
          url: sanitizeURL(upload.url),
        });
        emitter(END);
      },
    });

    upload.start();

    return () => upload.abort();
  });
}

// Upload Saga
function* uploadFileChannel(item) {
  const token = getToken();
  const file = {
    filename: item.name,
    filetype: item.type,
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
    const { error, progress = 0, success, url } = yield take(chan);
    const payload = {
      ...file,
      id: url,
      progress,
    };

    if (error) {
      yield put(uploadFileFailure(payload, url, error));
      yield call(delay, 5000);
      yield put(uploadFileReset());
      return;
    }

    if (success) {
      yield put(uploadFileSuccess(payload, url));
      yield call(delay, 5000);
      yield put(uploadFileReset());
      return;
    }

    yield put(uploadFileProgress(payload, url, progress));
  }
}

// Responsible for forking the worker threads to the uploadFile channel
function* uploadDispatcher(chan) {
  while (true) {
    const file = yield take(chan);
    yield call(uploadFileChannel, file);
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
    const { payload } = yield take('request/file/upload');
    // The upload action sends an array (not FileList) of Files
    yield all(payload.map(file => put(chan, file)));
  }
}

export default function* root() {
  yield call(uploadFileWatcher);
}
