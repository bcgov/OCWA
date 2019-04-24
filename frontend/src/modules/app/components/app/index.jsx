import React from 'react';
import PropTypes from 'prop-types';
import LayerManager from '@atlaskit/layer-manager';
import Loadable from 'react-loadable';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import Messages from '@src/modules/data/containers/messages';
import some from 'lodash/some';
import { exporterGroup, ocGroup, exporterMode } from '@src/services/config';
import '@atlaskit/css-reset';

import About from '../../containers/about';
import Auth from '../auth';
import Loading from './loading';
import ProjectSelection from './project-selection';
import Unauthorized from './unauthorized';
import * as styles from './styles.css';

const Exporter = Loadable({
  loader: () => import('../../../exporter/components/app'),
  loading: () => <Loading text="Initializing Exporter interface" />,
});
const OutputChecker = Loadable({
  loader: () => import('../../../output-checker/components/app'),
  loading: () => <Loading text="Initializing Output Checker interface" />,
});
const Download = Loadable({
  loader: () => import('../../../download/components/app'),
  loading: () => <Loading text="Initializing Exporter Download interface" />,
});

class App extends React.Component {
  componentDidMount() {
    const { fetchGroups, fetchToken, project } = this.props;

    if (project) {
      fetchToken(project);
    } else {
      fetchGroups();
    }
  }

  renderMain = () => {
    const {
      authFetchStatus,
      fetchToken,
      fetchStatus,
      groups,
      isAuthenticated,
      project,
      user,
    } = this.props;
    // TODO: These values should be in config.json
    const validGroups = [exporterGroup, ocGroup];
    let el = null;

    if (!project && !isEmpty(groups)) {
      return <ProjectSelection data={groups} onSelect={fetchToken} />;
    }

    if (isAuthenticated) {
      // Using `includes` here incase groups isn't an array depending on the auth env
      const hasExporterRole = includes(user.groups, exporterGroup);
      const hasOcRole = includes(user.groups, ocGroup);
      const hasValidGroupAccess = some(user.groups, g =>
        validGroups.includes(g)
      );

      if (!hasValidGroupAccess && user.groups) {
        return <Unauthorized />;
      }

      // Load bundle for output checker if that's the only role, otherwise always send exporter
      if (hasOcRole && !hasExporterRole) {
        el = <OutputChecker user={user} />;
      } else if (exporterMode === 'download') {
        el = <Download user={user} />;
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
          <About />
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
  fetchGroups: PropTypes.func.isRequired,
  fetchToken: PropTypes.func.isRequired,
  groups: PropTypes.arrayOf(PropTypes.string).isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  project: PropTypes.string,
  user: PropTypes.shape({
    displayName: PropTypes.string,
    groups: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default App;
