import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import App from '../components/app';
import { fetchToken } from '../actions';

const mapStateToProps = state => ({
  authFetchStatus: state.app.auth.fetchStatus,
  isAuthenticated: state.app.auth.isAuthenticated,
});

export default withRouter(
  connect(mapStateToProps, {
    fetchToken,
  })(App)
);
