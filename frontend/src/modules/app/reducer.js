import { combineReducers } from 'redux';

const initialViewState = {
  isAboutOpen: false,
};

function viewState(state = initialViewState, action) {
  switch (action.type) {
    case 'app/about/toggle':
      return {
        ...state,
        isAboutOpen: !state.isAboutOpen,
      };

    default:
      return state;
  }
}

const initialAuthState = {
  fetchStatus: 'idle',
  isAuthenticated: false,
  user: {},
};

function auth(state = initialAuthState, action) {
  switch (action.type) {
    case 'app/get/token/requested':
      return {
        ...state,
        fetchStatus: 'loading',
      };

    case 'app/get/token/success':
      return {
        ...state,
        fetchStatus: 'loaded',
        isAuthenticated: true,
        user: action.payload,
      };

    case 'app/get/token/failed':
      return {
        ...state,
        fetchStatus: 'failed',
      };

    default:
      return state;
  }
}

export default combineReducers({
  auth,
  viewState,
});
