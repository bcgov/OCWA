import { call, put, select, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import differenceInMilliseconds from 'date-fns/difference_in_milliseconds';
import ky from 'ky';
import { get } from '@src/services/api';
import { getRefreshToken, saveSession } from '@src/services/auth';
import { sessionStorageKey } from '@src/services/config';

import { versionsRequested, versionsSuccess, versionsFailed } from './actions';

const requestGroups = async () => {
  const response = await ky.get('/auth/groups');

  if (!response.ok) {
    throw new Error({
      status: response.status,
      text: response.statusText,
    });
  }

  return response.json();
};

const requestToken = async group => {
  const response = await ky.get(`/auth/session?group=${group}`);

  if (!response.ok) {
    throw new Error({
      status: response.status,
      text: response.statusText,
    });
  }

  return response.json();
};

const requestRefreshToken = async group => {
  const refreshToken = getRefreshToken();
  const response = await ky.post(`/auth/refresh?group=${group}`, {
    json: { refreshToken },
  });

  if (!response.ok) {
    throw new Error({
      status: response.status,
      text: response.statusText,
    });
  }

  return response.json();
};

function* groupsWatcher() {
  yield put({
    type: 'app/get/groups/requested',
  });

  try {
    const { groups } = yield call(requestGroups);
    yield put({
      type: 'app/get/groups/success',
      payload: groups,
    });
  } catch (err) {
    yield put({
      type: 'app/get/groups/failed',
      payload: err,
    });
  }
}

function* tokenWatcher(action) {
  yield put({
    type: 'app/get/token/requested',
  });

  sessionStorage.setItem(sessionStorageKey, action.payload);

  try {
    const payload = yield call(requestToken, action.payload);
    const refreshInt = differenceInMilliseconds(payload.expiresAt, Date.now());
    saveSession(payload);
    yield put({
      type: 'app/get/token/success',
      payload: payload.user,
    });
    yield call(delay, refreshInt);
    yield put({ type: 'app/get/refresh-token', payload: action.payload });
  } catch (err) {
    yield put({
      type: 'app/get/token/failed',
      payload: err,
    });
  }
}

export function* refreshTokenWatcher(action) {
  try {
    const payload = yield call(requestRefreshToken, action.payload);
    const refreshInt = differenceInMilliseconds(payload.expiresAt, Date.now());
    saveSession(payload);
    yield call(delay, refreshInt);
    yield put({ type: 'app/get/refresh-token', payload: action.payload });
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

export function clearAuth() {
  sessionStorage.clear();
}

export default function* root() {
  yield takeLatest('app/get/groups', groupsWatcher);
  yield takeLatest('app/get/token', tokenWatcher);
  yield takeLatest('app/get/token/failed', clearAuth);
  yield takeLatest('app/get/refresh-token', refreshTokenWatcher);
  yield takeLatest('app/about/toggle', fetchVersions);
}
