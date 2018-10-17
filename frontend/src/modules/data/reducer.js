import { combineReducers } from 'redux';
import merge from 'lodash/merge';

const entities = (state = {}, action) => {
  switch (action.type) {
    case 'data/get/success':
      return merge({}, state, action.payload.entities);

    default:
      return state;
  }
};

const initialFetchStatusState = {};

const fetchStatus = (state = initialFetchStatusState, action) => {
  switch (action.type) {
    case 'data/get/requested':
      return merge({}, state, {
        [action.meta.dataType]: {
          [action.meta.id]: 'loading',
        },
      });

    case 'data/get/success':
      return merge({}, state, {
        [action.meta.dataType]: {
          [action.meta.id]: 'loaded',
        },
      });

    case 'data/get/failed':
      return merge({}, state, {
        [action.meta.dataType]: {
          [action.meta.id]: 'failed',
        },
      });

    default:
      return state;
  }
};

export default combineReducers({
  entities,
  fetchStatus,
});
