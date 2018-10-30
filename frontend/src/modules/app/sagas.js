import { call, put, takeLatest } from 'redux-saga/effects';
import ky from 'ky';

import { getSession, saveSession } from '@src/services/auth';

const fetchToken = async () => {
  try {
    const json = await ky.get('/auth/session').json();
    return json;
  } catch (err) {
    throw new Error(err);
  }
};

function* getToken() {
  const savedToken = yield call(getSession);

  if (!savedToken) {
    yield put({
      type: 'app/get/token/requested',
    });

    try {
      const { token } = yield call(fetchToken);
      saveSession(token);
      yield put({
        type: 'app/get/token/success',
        payload: token,
      });
    } catch (err) {
      yield put({
        type: 'app/get/token/failed',
        error: true,
        payload: err,
      });
    }
  } else {
    yield put({
      type: 'app/get/token/success',
      payload: savedToken,
    });
  }
}

export default function* root() {
  yield takeLatest('app/get/token', getToken);
}
