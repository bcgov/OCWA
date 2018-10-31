import { combineReducers } from 'redux';

const initialAuthState = {
  fetchStatus: 'idle',
  isAuthenticated: false,
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
});
