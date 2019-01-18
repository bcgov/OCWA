import React from 'react';
import LayerManager from '@atlaskit/layer-manager';
import Loadable from 'react-loadable';
import includes from 'lodash/includes';
import Messages from '@src/modules/data/containers/messages';
import PropTypes from 'prop-types';
import '@atlaskit/css-reset';

import Auth from '../auth';
import Loading from './loading';
import Unauthorized from './unauthorized';
import * as styles from './styles.css';

const Exporter = Loadable({
  loader: () => import('../../../exporter/components/app'),
  loading: () => <Loading text="Initializing Loading Exporter interface" />,
});
const OutputChecker = Loadable({
  loader: () => import('../../../output-checker/components/app'),
  loading: () => <Loading text="Initializing Output Checker interface" />,
});

class App extends React.Component {
  componentDidMount() {
    const { fetchToken } = this.props;
    fetchToken();
  }

  componentDidUpdate(prevProps) {
    const { isAuthenticated, initSocket } = this.props;

    if (isAuthenticated && !prevProps.isAuthenticated) {
      initSocket();
    }
  }

  renderMain = () => {
    const { authFetchStatus, isAuthenticated, user } = this.props;
    let el = null;

    if (isAuthenticated) {
      const hasExporterRole = includes(user.groups, '/exporter');
      const hasOcRole = includes(user.groups, '/oc');

      // Load bundle for output checker if that's the only role, otherwise always send exporter
      if (hasOcRole && !hasExporterRole) {
        el = <OutputChecker user={user} />;
      } else {
        el = <Exporter user={user} />;
      }
    } else if (authFetchStatus === 'loaded') {
      el = <Unauthorized />;
    }

    return el;
  };

  render() {
    const { authFetchStatus, isAuthenticated } = this.props;
    const mainElement = this.renderMain();

    return (
      <LayerManager>
        <main id="app-main" className={styles.main}>
          <Messages />
          <Auth
            fetchStatus={authFetchStatus}
            isAuthenticated={isAuthenticated}
          />
          {mainElement}
        </main>
      </LayerManager>
    );
  }
}

App.propTypes = {
  authFetchStatus: PropTypes.string.isRequired,
  fetchToken: PropTypes.func.isRequired,
  initSocket: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    displayName: PropTypes.string,
  }).isRequired,
};

export default App;
