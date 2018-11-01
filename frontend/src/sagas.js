import { all, fork } from 'redux-saga/effects';

import appSagas from './modules/app/sagas';
import dataSagas from './modules/data/sagas';

export default function* root() {
  yield all([fork(appSagas), fork(dataSagas)]);
}
