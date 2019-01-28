import React from 'react';
import PropTypes from 'prop-types';
import LayerManager from '@atlaskit/layer-manager';
import Loadable from 'react-loadable';
import includes from 'lodash/includes';
import Messages from '@src/modules/data/containers/messages';
import some from 'lodash/some';
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
    // TODO: These values should be in config.json
    const exporterGroup = '/exporter';
    const ocGroup = '/oc';
    const validGroups = [exporterGroup, ocGroup];
    let el = null;

    if (isAuthenticated) {
      // Using `includes` here incase groups isn't an array depending on the auth env
      const hasExporterRole = includes(user.groups, exporterGroup);
      const hasOcRole = includes(user.groups, ocGroup);
      const hasValidGroupAccess = some(user.groups, g =>
        validGroups.includes(g)
      );
      console.log(hasExporterRole, hasOcRole, hasValidGroupAccess);

      if (!hasValidGroupAccess) {
        return <Unauthorized />;
      }

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
