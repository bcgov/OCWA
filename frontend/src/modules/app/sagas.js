import { call, put, takeLatest } from 'redux-saga/effects';
import ky from 'ky';

import { saveSession } from '@src/services/auth';

const fetchToken = async () => {
  const response = await ky.get('/auth/session');

  if (!response.ok) {
    throw new Error({
      status: response.status,
      text: response.statusText,
    });
  }

  return response.json();
};

function* getToken() {
  yield put({
    type: 'app/get/token/requested',
  });

  try {
    const payload = yield call(fetchToken);
    saveSession(payload.token);
    yield put({
      type: 'app/get/token/success',
      payload,
    });
  } catch (err) {
    yield put({
      type: 'app/get/token/failed',
      error: true,
      payload: err,
    });
  }
}

export default function* root() {
  yield takeLatest('app/get/token', getToken);
}
