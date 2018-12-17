import at from 'lodash/at';
import { call, put, takeEvery } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import compact from 'lodash/compact';
import has from 'lodash/has';
import head from 'lodash/head';
import { normalize } from 'normalizr';
import { camelizeKeys } from 'humps';

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
    const response = yield call(api[method], url, {
      ...rest,
      payload: action.payload,
    });
    const data = camelizeKeys(
      response,
      (key, convert) => (/^(_id|_v)$/.test(key) ? key : convert(key))
    );
    const payload =
      schema && !has(data, 'error') ? normalize(data, schema) : data;

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

  yield call(delay, 3000);
  yield put({
    type: `${action.type}/reset`,
    meta,
  });
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
  yield takeEvery(
    action => /\w+\/get$/.test(action.type),
    handleDataRequest,
    'get'
  );
  yield takeEvery(
    action => /\w+\/post$/.test(action.type),
    handleDataRequest,
    'post'
  );
  yield takeEvery(
    action => /\w+\/put$/.test(action.type),
    handleDataRequest,
    'put'
  );
  yield takeEvery(
    action => /\w+\/delete$/.test(action.type),
    handleDeleteRequest
  );
}
