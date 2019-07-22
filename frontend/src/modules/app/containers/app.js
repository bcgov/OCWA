import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { withRouter } from 'react-router-dom';
import { initSocket } from '@src/modules/discussion/actions';
import { helpURL, zone } from '@src/services/config';

import App from '../components/app';
import { fetchToken } from '../actions';

const mapStateToProps = state => ({
  authFetchStatus: state.app.auth.fetchStatus,
  isAuthenticated: !isEmpty(state.app.auth.user),
  helpURL,
  user: state.app.auth.user,
  zone,
});

export default withRouter(
  connect(mapStateToProps, {
    fetchToken,
    initSocket,
  })(App)
);
