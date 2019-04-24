import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { withRouter } from 'react-router-dom';

import App from '../components/app';
import { fetchGroups, fetchToken } from '../actions';

const mapStateToProps = state => ({
  authFetchStatus: state.app.auth.fetchStatus,
  isAuthenticated:
    !isEmpty(state.app.auth.user) || !isEmpty(state.app.auth.groups),
  project: state.app.auth.project,
  user: state.app.auth.user,
  groups: state.app.auth.groups,
});

export default withRouter(
  connect(mapStateToProps, {
    fetchGroups,
    fetchToken,
  })(App)
);
