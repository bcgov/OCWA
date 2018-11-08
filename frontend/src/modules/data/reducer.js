import { combineReducers } from 'redux';
import has from 'lodash/has';
import isArray from 'lodash/isArray';
import merge from 'lodash/merge';

function handleFetchStatus(state, action, fetchStatus) {
  let entityFetchStatus = {};
  let dataTypesFetchStatus = {};

  if (!action.meta.id) {
    if (has(action, 'payload.result')) {
      if (isArray(action.payload.result)) {
        const ids = action.payload.result.reduce(
          (prev, id) => ({
            ...prev,
            [id]: fetchStatus,
          }),
          {}
        );
        entityFetchStatus = {
          [action.meta.dataType]: ids,
        };
      } else {
        entityFetchStatus = {
          [action.meta.dataType]: {
            [action.payload.result.request]: fetchStatus,
          },
        };
      }
    }

    dataTypesFetchStatus = {
      [action.meta.dataType]: fetchStatus,
    };
  } else {
    entityFetchStatus = {
      [action.meta.dataType]: {
        [action.meta.id]: fetchStatus,
      },
    };
  }

  return merge({}, state, {
    entities: entityFetchStatus,
    dataTypes: dataTypesFetchStatus,
  });
}

const entities = (state = {}, action) => {
  if (/\w+\/(get|post|put)\/success$/.test(action.type)) {
    return merge({}, state, action.payload.entities);
  }

  return state;
};

const initialFetchStatusState = {
  entities: {},
  dataTypes: {},
};

const fetchStatus = (state = initialFetchStatusState, action) => {
  let nextState = state;

  if (/\w+\/(post)\/requested$/.test(action.type)) {
    nextState = handleFetchStatus(state, action, 'creating');
  } else if (/\w+\/post\/reset$/.test(action.type)) {
    nextState = handleFetchStatus(state, action, 'idle');
  } else if (/\w+\/get\/requested$/.test(action.type)) {
    nextState = handleFetchStatus(state, action, 'loading');
  } else if (/\w+\/(get|post)\/success$/.test(action.type)) {
    nextState = handleFetchStatus(state, action, 'loaded');
  } else if (/\w+\/(get|post)\/failed$/.test(action.type)) {
    nextState = handleFetchStatus(state, action, 'failed');
  }

  return nextState;
};

export default combineReducers({
  entities,
  fetchStatus,
});
