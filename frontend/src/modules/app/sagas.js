import { call, put, select, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import differenceInMilliseconds from 'date-fns/difference_in_milliseconds';
import ky from 'ky';
import { get } from '@src/services/api';
import { getRefreshToken, saveSession } from '@src/services/auth';
import { sessionStorageKey } from '@src/services/config';

import { versionsRequested, versionsSuccess, versionsFailed } from './actions';

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
      payload: err,
    });
  }
}

export function* fetchVersions() {
  const fetchStatus = yield select(state => state.app.versions.fetchStatus);

  if (fetchStatus !== 'loaded') {
    yield put(versionsRequested());

    try {
      const payload = yield call(get, '/versions');
      yield put(versionsSuccess(payload.versions));
    } catch (e) {
      yield put(versionsFailed(e));
    }
  }
}

export function saveProject(action) {
  sessionStorage.setItem(sessionStorageKey, action.payload);
}

export function clearAuth() {
  sessionStorage.clear();
}

export default function* root() {
  yield takeLatest('app/get/token', tokenWatcher);
  yield takeLatest('app/get/token/failed', clearAuth);
  yield takeLatest('app/get/refresh-token', refreshTokenWatcher);
  yield takeLatest('app/about/toggle', fetchVersions);
  yield takeLatest('app/project-selected', saveProject);
}
