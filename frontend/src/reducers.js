import { combineReducers } from 'redux';

import app from './modules/app/reducer';
import data from './modules/data/reducer';
import files from './modules/files/reducer';
import discussion from './modules/discussion/reducer';
import download from './modules/download/reducer';
import outputChecker from './modules/output-checker/reducer';
import requests from './modules/requests/reducer';
import reports from './modules/reports/reducer';

export default combineReducers({
  app,
  data,
  discussion,
  download,
  files,
  outputChecker,
  requests,
  reports,
});
