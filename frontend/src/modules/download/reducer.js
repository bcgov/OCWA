import { combineReducers } from 'redux';

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

export default combineReducers({
  viewState,
});
