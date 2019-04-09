import { combineReducers } from 'redux';

import entities from './entities';
import fileTypes from './file-types';
import uploadStatus from './upload-status';

export default combineReducers({
  entities,
  fileTypes,
  uploadStatus,
});
