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
        currentNewRequestStep: 0,
      };

    case 'requests/change-step':
      return {
        ...state,
        currentNewRequestStep: action.payload,
      };

    case 'request/put/success':
    case 'request/post/success':
      return {
        ...state,
        currentRequestId: action.meta.quitEditing
          ? null
          : state.currentRequestId,
        currentNewRequestStep: action.meta.quitEditing ? 0 : 1,
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
