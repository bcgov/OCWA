import { combineReducers } from 'redux';

import app from './modules/app/reducer';
import data from './modules/data/reducer';
import discussion from './modules/discussion/reducer';
import download from './modules/download/reducer';
import files from './modules/files/reducer';
import help from './modules/help/reducer';
import outputChecker from './modules/output-checker/reducer';
import requests from './modules/requests/reducer';
import reports from './modules/reports/reducer';

export default combineReducers({
  app,
  data,
  discussion,
  download,
  files,
  help,
  outputChecker,
  requests,
  reports,
});
