import { combineReducers } from 'redux';
import get from 'lodash/get';
import merge from 'lodash/merge';

const initialViewState = {
  currentRequestId: null,
  currentNewRequestStep: 0,
  filter: null,
  search: '',
};

const viewState = (state = initialViewState, action = {}) => {
  switch (action.type) {
    case 'requests/filter':
      return {
        ...state,
        filter: action.payload,
      };

    case 'requests/search':
      return {
        ...state,
        search: action.payload,
      };

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
          : get(action, 'payload.result.result', state.currentRequestId),
        currentNewRequestStep: action.meta.quitEditing ? 0 : 1,
      };

    default:
      return state;
  }
};

const files = (state = {}, action = {}) => {
  if (
    action.type === 'request/file/upload/progress' ||
    action.type === 'request/file/upload/failed'
  ) {
    return merge({}, state, {
      [action.meta.url]: {
        ...action.meta.file,
        id: action.meta.url,
      },
    });
  }

  return state;
};

const uploads = (state = {}, action = {}) => {
  switch (action.type) {
    case 'request/file/upload/progress':
      return {
        ...state,
        [action.meta.url]: action.payload,
      };

    case 'request/file/upload/success':
      return {
        ...state,
        [action.meta.url]: 'loaded',
      };

    case 'request/file/upload/failed':
      return {
        ...state,
        [action.meta.url]: 'failed',
      };

    case 'request/put/success':
    case 'request/put/failed':
    case 'request/close/draft':
      return {};

    default:
      return state;
  }
};

export default combineReducers({
  viewState,
  files,
  uploads,
});
