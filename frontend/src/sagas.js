import { all, fork } from 'redux-saga/effects';

import dataSagas from './modules/data/sagas';

export default function* root() {
  yield all([fork(dataSagas)]);
}
