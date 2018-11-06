import { combineReducers } from 'redux';

const initialViewState = {
  currentRequestId: null,
  currentNewRequestStep: 0,
};

const viewState = (state = initialViewState, action = {}) => {
  switch (action.type) {
    case 'requests/view/draft':
      return {
        ...state,
        currentRequestId: action.payload,
      };

    case 'requests/close/draft':
      return {
        ...state,
        currentRequestId: null,
      };

    case 'requests/change-step':
      return {
        ...state,
        currentNewRequestStep: action.payload,
      };
    default:
      return state;
  }
};

const initialNewRequestState = {
  request: {},
};

const newRequest = (state = initialNewRequestState, action = {}) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default combineReducers({
  viewState,
  newRequest,
});
