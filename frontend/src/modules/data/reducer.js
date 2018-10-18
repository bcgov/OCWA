import { combineReducers } from 'redux';
import isArray from 'lodash/isArray';
import merge from 'lodash/merge';

function handleFetchStatus(state, action) {
  let loadedFetchStatus = {};

  if (isArray(action.payload.result)) {
    const ids = action.payload.result.reduce(
      (prev, id) => ({
        ...prev,
        [id]: 'loaded',
      }),
      {}
    );
    loadedFetchStatus = {
      [action.meta.dataType]: {
        [action.meta.id]: 'loaded',
        ...ids,
      },
    };
  } else {
    loadedFetchStatus = {
      [action.meta.dataType]: {
        [action.meta.id]: 'loaded',
      },
    };
  }

  return merge({}, state, loadedFetchStatus);
}

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
      return handleFetchStatus(state, action);

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
