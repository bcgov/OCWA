import { all, fork } from 'redux-saga/effects';

import appSagas from './modules/app/sagas';
import dataSagas from './modules/data/sagas';
import requestSagas from './modules/requests/sagas';

export default function* root() {
  yield all([fork(appSagas), fork(dataSagas), fork(requestSagas)]);
}
