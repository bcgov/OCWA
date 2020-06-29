import { combineReducers } from 'redux';

const initialViewState = {
  isAboutOpen: false,
  isOnboardingEnabled: false,
  isReportErrorOpen: false,
};

function viewState(state = initialViewState, action = {}) {
  switch (action.type) {
    case 'app/about/toggle':
      return {
        ...state,
        isAboutOpen: !state.isAboutOpen,
      };

    case 'app/onboarding/toggle':
      return {
        ...state,
        isOnboardingEnabled: !state.isOnboardingEnabled,
      };

    case 'app/report-error/toggle':
      return {
        ...state,
        isReportErrorOpen: !state.isReportErrorOpen,
      };

    case 'user/report-error':
      return {
        ...state,
        isReportErrorOpen: false,
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

function auth(state = initialAuthState, action = {}) {
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

const initialVersionsState = {
  fetchStatus: 'idle',
  entities: [],
};

function versions(state = initialVersionsState, action = {}) {
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
