import { call, put, take, takeLatest } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { getSession } from '@src/services/auth';
import tus from 'tus-js-client';

import {
  uploadFileFailure,
  uploadFileProgress,
  uploadFileSuccess,
} from './actions';

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
        }),
      onProgress: (bytesUploaded, bytesTotal) =>
        emitter({
          file,
          progress: (bytesUploaded / bytesTotal * 100).toFixed(2),
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

function* uploadFile(action) {
  const file = action.payload;
  const token = yield call(getSession);
  const metaData = {
    filename: file.name,
    filetype: file.type,
    lastModified: file.lastModified,
    jwt: 'azureaccountname', // NOTE: Just a temp until local testing is complete
  };
  const channel = yield call(uploadChannel, file, metaData);

  while (true) {
    const { error, progress = 0, success, url } = yield take(channel);

    if (error) {
      yield put(uploadFileFailure(file, error));
      return;
    }

    if (success) {
      yield put(uploadFileSuccess(file, url));
      return;
    }

    yield put(uploadFileProgress(file, progress));
  }
}

export default function* root() {
  yield takeLatest('request/file/upload', uploadFile);
}
