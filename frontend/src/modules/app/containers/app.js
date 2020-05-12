import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { withRouter } from 'react-router-dom';
import { helpURL, zone } from '@src/services/config';

import App from '../components/app';
import { fetchToken, initSockets, toggleOnboarding } from '../actions';

const mapStateToProps = state => ({
  authFetchStatus: state.app.auth.fetchStatus,
  isAuthenticated: !isEmpty(state.app.auth.user),
  isOnboardingEnabled: state.app.viewState.isOnboardingEnabled,
  helpURL,
  user: state.app.auth.user,
  zone,
});

export default withRouter(
  connect(mapStateToProps, {
    fetchToken,
    onToggleOnboarding: toggleOnboarding,
    initSockets,
  })(App)
);
