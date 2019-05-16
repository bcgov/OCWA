import { combineReducers } from 'redux';
import get from 'lodash/get';
import union from 'lodash/union';

const inititalViewState = {
  page: 1,
  search: '',
  selectedRequest: null,
  sortKey: 'updatedOn',
  sortOrder: 'DESC',
};

function viewState(state = inititalViewState, action = {}) {
  switch (action.type) {
    case 'downloads/open':
      return {
        ...state,
        selectedRequest: action.payload,
      };

    case 'downloads/close':
      return {
        ...state,
        selectedRequest: null,
      };

    case 'downloads/requests/sort':
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}

function ids(state = [], action = {}) {
  if (action.type === 'requests/get/success') {
    if (get(action, 'meta.state') === 4) {
      return union(state, action.payload.result);
    }
  }

  return state;
}

function requestTypes(state = {}, action = {}) {
  if (action.type === 'request-types/get/success') {
    return action.payload;
  }

  return state;
}

export default combineReducers({
  ids,
  requestTypes,
  viewState,
});
