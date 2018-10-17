import at from 'lodash/at';
import { call, put, takeLatest } from 'redux-saga/effects';
import compact from 'lodash/compact';
import head from 'lodash/head';
import { normalize } from 'normalizr';

import api from '@src/services/api';

function* handleFetchData(action) {
  const { schema, id, url, ...rest } = action.payload;
  const keyPaths = at(schema, ['key', 'schema.key']);
  const dataType = head(compact(keyPaths));
  const meta = {
    ...action.meta,
    url,
    dataType,
    id,
  };

  yield put({
    type: `${action.type}/requested`,
    meta,
  });

  try {
    const data = yield call(api.get, url, rest);
    const payload = normalize(data, schema);

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
}

export default function*() {
  yield takeLatest('data/get', handleFetchData);
}
