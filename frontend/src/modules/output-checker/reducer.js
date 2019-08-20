import { combineReducers } from 'redux';
import get from 'lodash/get';
import has from 'lodash/has';

const initialViewState = {
  search: '',
  navSearch: '',
  state: 2, // Between 2 - 6
  filter: 'mine', // Enum: 'all', 'mine', 'unassigned'
  isApprovingRequest: false, // Only used to show long
};

function viewState(state = initialViewState, action = {}) {
  switch (action.type) {
    case 'requests/get':
      return {
        ...state,
        state: has(action, 'payload.state')
          ? action.payload.state
          : state.state,
      };

    case 'requests/filter/changed':
      return {
        ...state,
        filter: action.payload,
      };

    case 'requests/search':
      return {
        ...state,
        search: action.payload,
      };

    case 'requests/state/changed':
      return {
        ...state,
        state: action.payload,
      };

    case 'request/get/success':
      return {
        ...state,
        state: get(
          action,
          ['payload', 'entities', 'requests', action.payload.result, 'state'],
          2,
        ),
      };

    case 'request/nav/search':
      return {
        ...state,
        navSearch: action.payload,
      };

    case 'request/put/requested':
      return {
        ...state,
        isApprovingRequest: /approve/.test(action.meta.url),
      };

    case 'request/put/failed':
    case 'request/put/success':
      return {
        ...state,
        isApprovingRequest: false,
      };

    default:
      return state;
  }
}

export default combineReducers({
  viewState,
});
