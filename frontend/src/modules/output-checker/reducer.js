import { combineReducers } from 'redux';
import get from 'lodash/get';

const initialViewState = {
  search: '',
  state: 2, // Between 2 - 6
  filter: 'all', // Enum: 'all', 'mine', 'unassigned'
};

function viewState(state = initialViewState, action = {}) {
  switch (action.type) {
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
          2
        ),
      };

    default:
      return state;
  }
}

export default combineReducers({
  viewState,
});
