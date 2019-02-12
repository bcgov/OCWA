import { combineReducers } from 'redux';

import app from './modules/app/reducer';
import data from './modules/data/reducer';
import requests from './modules/requests/reducer';
import discussion from './modules/discussion/reducer';
import download from './modules/download/reducer';
import outputChecker from './modules/output-checker/reducer';

export default combineReducers({
  app,
  data,
  discussion,
  download,
  outputChecker,
  requests,
});
