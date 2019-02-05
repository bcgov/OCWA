import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { withRouter } from 'react-router-dom';
import { initSocket } from '@src/modules/discussion/actions';

import App from '../components/app';
import { fetchToken } from '../actions';

const mapStateToProps = state => ({
  authFetchStatus: state.app.auth.fetchStatus,
  isAuthenticated: !isEmpty(state.app.auth.user),
  user: state.app.auth.user,
});

export default withRouter(
  connect(mapStateToProps, {
    fetchToken,
    initSocket,
  })(App)
);
