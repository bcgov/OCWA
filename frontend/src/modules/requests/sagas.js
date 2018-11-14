import { call, put, take, takeLatest } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
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
      },
    });

    upload.start();

    return () => upload.abort();
  });
}

// Upload Saga
function* uploadFile(action) {
  const file = {
    filename: action.payload.name,
    filetype: action.payload.type,
    lastModified: action.payload.lastModified,
    size: action.payload.size,
  };
  const token = yield call(getSession);
  const metaData = {
    ...file,
    jwt: 'azureaccountname', // NOTE: Just a temp until local testing is complete, use `token` instead
  };
  // Create the channel with the file and the metadata
  const channel = yield call(uploadChannel, action.payload, metaData);

  while (true) {
    // File upload states from TUS, the file is from the upload above
    const { error, progress = 0, success, url } = yield take(channel);
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

export default function* root() {
  yield takeLatest('request/file/upload', uploadFile);
}
