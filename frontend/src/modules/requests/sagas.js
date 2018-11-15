import { all, call, fork, put, take, takeLatest } from 'redux-saga/effects';
import { channel, eventChannel, END } from 'redux-saga';
import { getSession } from '@src/services/auth';
import tus from 'tus-js-client';

import {
  uploadFileFailure,
  uploadFileProgress,
  uploadFileSuccess,
} from './actions';

// Channel to handle the file uploads with TUS
// file: File object
// metadata: composed details, includes filename, filetype, lastModified and jwt
function uploadChannel(file, metadata) {
  return eventChannel(emitter => {
    const upload = new tus.Upload(file, {
      endpoint: 'http://localhost:1080/files/',
      retryDelays: [0, 1000, 3000, 5000],
      metadata,
      onError: error =>
        emitter({
          error,
          file,
          url: upload.url,
        }),
      onProgress: (bytesUploaded, bytesTotal) =>
        emitter({
          file,
          progress: bytesUploaded / bytesTotal * 100,
          url: upload.url,
        }),
      onSuccess: () => {
        emitter({
          file,
          success: true,
          url: upload.url,
        });
        emitter(END);
      },
    });

    upload.start();

    return () => upload.abort();
  });
}

// Upload Saga
function* uploadFile(item) {
  // const token = yield call(getSession);
  const file = {
    filename: item.name,
    filetype: item.type,
    lastModified: item.lastModified,
    size: item.size,
  };
  const metaData = {
    ...file,
    jwt: 'azureaccountname', // NOTE: Just a temp until local testing is complete, use `token` instead
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
      return;
    }

    if (success) {
      yield put(uploadFileSuccess(payload, url));
      return;
    }

    yield put(uploadFileProgress(payload, url, progress));
  }
}

function* handleUploader(chan) {
  while (true) {
    const file = yield take(chan);
    yield call(uploadFile, file);
  }
}

function* watcher() {
  const chan = yield call(channel);

  for (let i = 0; i < 3; i++) {
    yield fork(handleUploader, chan);
  }

  while (true) {
    const { payload } = yield take('request/file/upload');
    yield all(payload.map(file => put(chan, file)));
  }
}

export default function* root() {
  yield call(watcher);
  // yield takeLatest('request/file/upload', uploadFile);
}
