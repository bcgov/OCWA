import { combineReducers } from 'redux';

import filters from './filters';
import projects from './projects';

export default combineReducers({
  filters,
  projects,
});
