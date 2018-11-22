import at from 'lodash/at';
import { call, put, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import compact from 'lodash/compact';
import head from 'lodash/head';
import { normalize } from 'normalizr';

import api, { destroy } from '@src/services/api';

function* handleDataRequest(method, action) {
  const { schema, id, url, ...rest } = action.meta;
  const keyPaths = at(schema, ['key', 'schema.key', 'result.key']);
  const dataType = head(compact(keyPaths));
  const meta = {
    url,
    dataType,
    id,
    ...rest,
  };

  yield put({
    type: `${action.type}/requested`,
    meta,
  });

  try {
    const data = yield call(api[method], url, {
      ...rest,
      payload: action.payload,
    });
    const payload = schema ? normalize(data, schema) : data;

    yield put({
      type: `${action.type}/success`,
      meta,
      payload,
    });
  } catch (err) {
    yield put({
      type: `${action.type}/failed`,
      error: true,
      meta,
      payload: err,
    });
  }

  if (method !== 'get') {
    yield call(delay, 3000);
    yield put({
      type: `${action.type}/reset`,
      meta,
    });
  }
}

function* handleDeleteRequest(action) {
  const meta = {
    ...action.meta,
    id: action.payload,
  };

  yield put({
    type: `${action.type}/requested`,
    meta,
  });

  try {
    yield call(destroy, action.meta.url);
    yield put({
      type: `${action.type}/success`,
      meta,
    });
  } catch (err) {
    yield put({
      type: `${action.type}/failed`,
      error: true,
      meta,
      payload: err,
    });
  }
}

export default function*() {
  yield takeLatest(
    action => /\w+\/get$/.test(action.type),
    handleDataRequest,
    'get'
  );
  yield takeLatest(
    action => /\w+\/post$/.test(action.type),
    handleDataRequest,
    'post'
  );
  yield takeLatest(
    action => /\w+\/put$/.test(action.type),
    handleDataRequest,
    'put'
  );
  yield takeLatest(
    action => /\w+\/delete$/.test(action.type),
    handleDeleteRequest
  );
}
