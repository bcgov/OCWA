import React from 'react';
import LayerManager from '@atlaskit/layer-manager';
import Loadable from 'react-loadable';
import Messages from '@src/modules/data/containers/messages';
import PropTypes from 'prop-types';
import '@atlaskit/css-reset';

import Auth from '../auth';
import Loading from './loading';
import * as styles from './styles.css';

const Exporter = Loadable({
  loader: () => import('../../../exporter/components/app'),
  loading: () => <Loading role="Exporter" />,
});
const OutputChecker = Loadable({
  loader: () => import('../../../output-checker/components/app'),
  loading: () => <Loading role="Output Checker" />,
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
    const { isAuthenticated, user } = this.props;
    let el = null;

    if (isAuthenticated) {
      if (user.groups.includes('/oc')) {
        el = <OutputChecker user={user} />;
      } else if (user.groups.includes('/exporter')) {
        el = <Exporter user={user} />;
      }
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
