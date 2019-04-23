import { combineReducers } from 'redux';
import { sessionStorageKey } from '@src/services/config';

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
  project: sessionStorage.getItem(sessionStorageKey) || null,
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

    case 'app/project-selected':
      return {
        ...state,
        project: action.payload,
      };

    default:
      return state;
  }
}

const initialVersionsState = {
  fetchStatus: 'idle',
  entities: [],
};

function versions(state = initialVersionsState, action) {
  switch (action.type) {
    case 'app/versions/requested':
      return {
        ...state,
        fetchStatus: 'loading',
      };

    case 'app/versions/success':
      return {
        ...state,
        fetchStatus: 'loaded',
        entities: action.payload,
      };

    case 'app/versions/failed':
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
  versions,
});
