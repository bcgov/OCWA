import { combineReducers } from 'redux';
import at from 'lodash/at';
import compact from 'lodash/compact';
import get from 'lodash/get';
import has from 'lodash/has';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import last from 'lodash/last';
import merge from 'lodash/merge';
import omit from 'lodash/omit';
import uniqueId from 'lodash/uniqueId';

function handleFetchStatus(state, action, fetchStatus) {
  let entityFetchStatus = {};
  let dataTypesFetchStatus = {};

  // If there isn't an ID present, assume it's probably an array
  if (!action.meta.id) {
    // If there is a result, we can parse through the IDs
    if (has(action, 'payload.result')) {
      // Array suggests there is a list to deal with
      if (isArray(action.payload.result)) {
        // Output an object with the key/value pair of id: fetchStatus
        const ids = action.payload.result.reduce(
          (prev, id) => ({
            ...prev,
            [id]: fetchStatus,
          }),
          {}
        );
        // Merge an object of the data type with the updated ID states
        entityFetchStatus = {
          [action.meta.dataType]: ids,
        };
      } else {
        // For a single object, it's a simpler affair
        const resultId = isString(action.payload.result)
          ? action.payload.result
          : get(action, 'payload.result.result', '');
        if (resultId) {
          entityFetchStatus = {
            [action.meta.dataType]: {
              [resultId]: fetchStatus,
            },
          };
        }
      }
    }

    // Assign the updated fetch status for the array of data types
    dataTypesFetchStatus = {
      [action.meta.dataType]: fetchStatus,
    };
  } else {
    // If there is an ID in the meta, use that.
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

const handlePostStatus = (state, action) => {
  const postRequests = {
    [action.meta.dataType]: {},
  };
  const entities = { [action.meta.dataType]: {} };

  if (/\w+\/post\/requested$/.test(action.type)) {
    postRequests[action.meta.dataType] = {
      [action.meta.id]: 'creating',
    };
  } else if (/\w+\/post\/success$/.test(action.type)) {
    postRequests[action.meta.dataType] = {
      [action.meta.id]: 'loaded',
    };
    entities[action.meta.dataType] = {
      [action.payload.result.result]: 'loaded',
    };
  } else if (/\w+\/post\/failed$/.test(action.type)) {
    postRequests[action.meta.dataType] = {
      [action.meta.id]: 'failed',
    };
  } else if (/\w+\/post\/reset$/.test(action.type)) {
    return omit(
      state,
      `postRequests.${action.meta.dataType}.${action.meta.id}`
    );
  }

  return merge({}, state, {
    postRequests,
    entities,
  });
};

const entities = (state = {}, action) => {
  if (/\w+\/(get|post|put)\/success$/.test(action.type)) {
    return merge({}, state, action.payload.entities);
  }

  if (/\w+\/delete\/success$/.test(action.type)) {
    return omit(state, `${action.meta.dataType}.${action.meta.id}`);
  }

  return state;
};

const initialFetchStatusState = {
  // This is the model data store, organized by type, then id: fetch status
  entities: {},
  // Any list requests are stored here by type
  dataTypes: {},
  // New requests have temp ID's so their progress is tracked here.
  postRequests: {},
};

const fetchStatus = (state = initialFetchStatusState, action) => {
  let nextState = state;

  if (/\w+\/(post)\/(requested|success|failed|reset)$/.test(action.type)) {
    // POST requests have temp ID's usually, so their fetch state should be separate
    nextState = handlePostStatus(state, action);
  } else if (/\w+\/get\/requested$/.test(action.type)) {
    nextState = handleFetchStatus(state, action, 'loading');
  } else if (/\w+\/put\/requested$/.test(action.type)) {
    nextState = handleFetchStatus(state, action, 'saving');
  } else if (/\w+\/(get|put)\/success$/.test(action.type)) {
    nextState = handleFetchStatus(state, action, 'loaded');
  } else if (/\w+\/delete\/requested$/.test(action.type)) {
    nextState = handleFetchStatus(state, action, 'deleting');
  } else if (/\w+\/delete\/success$/.test(action.type)) {
    nextState = handleFetchStatus(state, action, 'deleted');
  } else if (/\w+\/(delete|get|put|post)\/failed$/.test(action.type)) {
    nextState = handleFetchStatus(state, action, 'failed');
  }

  return nextState;
};

const messages = (state = [], action) => {
  const actionMessages = action.error
    ? [action.payload.message]
    : compact(
        at(action, [
          'payload.result.message',
          'payload.result.error',
          'payload.error',
        ])
      );
  const hasErrorMessage =
    action.error ||
    has(action, 'payload.result.error') ||
    has(action, 'payload.error');

  if (actionMessages.length > 0) {
    const newMessages = actionMessages.map(message => ({
      id: uniqueId('messages'),
      type: hasErrorMessage ? 'failed' : last(action.type.split('/')),
      message,
    }));

    return [...newMessages, ...state];
  }

  // TODO: probably can shorten this regex
  if (/\w+\/\w+\/reset$/.test(action.type)) {
    return state.filter((d, index) => index !== 0);
  }

  return state;
};

export default combineReducers({
  entities,
  fetchStatus,
  messages,
});
