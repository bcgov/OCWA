import { call, put, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import differenceInMilliseconds from 'date-fns/difference_in_milliseconds';
import ky from 'ky';

import { getRefreshToken, saveSession } from '@src/services/auth';

const requestToken = async () => {
  const response = await ky.get('/auth/session');

  if (!response.ok) {
    throw new Error({
      status: response.status,
      text: response.statusText,
    });
  }

  return response.json();
};

const requestRefreshToken = async () => {
  const refreshToken = getRefreshToken();
  const response = await ky.post('/auth/refresh', { json: { refreshToken } });

  if (!response.ok) {
    throw new Error({
      status: response.status,
      text: response.statusText,
    });
  }

  return response.json();
};

function* tokenWatcher() {
  yield put({
    type: 'app/get/token/requested',
  });

  try {
    const payload = yield call(requestToken);
    const refreshInt = differenceInMilliseconds(payload.expiresAt, Date.now());
    saveSession(payload);
    yield put({
      type: 'app/get/token/success',
      payload: payload.user,
    });
    yield call(delay, refreshInt);
    yield put({ type: 'app/get/refresh-token' });
  } catch (err) {
    yield put({
      type: 'app/get/token/failed',
      error: true,
      payload: err,
    });
  }
}

export function* refreshTokenWatcher() {
  try {
    const payload = yield call(requestRefreshToken);
    const refreshInt = differenceInMilliseconds(payload.expiresAt, Date.now());
    saveSession(payload);
    yield call(delay, refreshInt);
    yield put({ type: 'app/get/refresh-token' });
  } catch (err) {
    yield put({
      type: 'app/get/token/failed',
      error: true,
      payload: err,
    });
  }
}

export default function* root() {
  yield takeLatest('app/get/token', tokenWatcher);
  yield takeLatest('app/get/refresh-token', refreshTokenWatcher);
}
