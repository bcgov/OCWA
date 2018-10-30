import { connect } from 'react-redux';

import App from '../components/app';
import { fetchToken } from '../actions';

const mapStateToProps = state => ({
  authFetchStatus: state.app.auth.fetchStatus,
  isAuthenticated: state.app.auth.isAuthenticated,
});

export default connect(mapStateToProps, {
  fetchToken,
})(App);
