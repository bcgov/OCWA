import React from 'react';
import PropTypes from 'prop-types';
import LayerManager from '@atlaskit/layer-manager';
import Loadable from 'react-loadable';
import includes from 'lodash/includes';
import Messages from '@src/modules/data/containers/messages';
import some from 'lodash/some';
import { SpotlightManager, SpotlightTransition } from '@atlaskit/onboarding';
import {
  exporterGroup,
  ocGroup,
  reportsGroup,
  exporterMode,
} from '@src/services/config';
import ReportError from '@src/modules/app/containers/report-error';
import '@atlaskit/css-reset';

import About from '../../containers/about';
import Auth from '../auth';
import Loading from './loading';
import Onboarding from '../../containers/onboarding';
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
const Reports = Loadable({
  loader: () => import('../../../reports/containers/app'),
  loading: () => <Loading text="Initializing Reports interface" />,
});

class App extends React.Component {
  componentDidMount() {
    const { fetchToken } = this.props;
    fetchToken();
  }

  componentDidUpdate(prevProps) {
    const { isAuthenticated, initSockets } = this.props;

    if (isAuthenticated && !prevProps.isAuthenticated) {
      initSockets();
    }
  }

  renderMain = () => {
    const {
      authFetchStatus,
      helpURL,
      isAuthenticated,
      onOpenHelp,
      onToggleOnboarding,
      user,
      zone,
    } = this.props;
    // TODO: These values should be in config.json
    const validGroups = [exporterGroup, ocGroup, reportsGroup];
    let el = null;

    if (isAuthenticated) {
      // Using `includes` here incase groups isn't an array depending on the auth env
      const hasExporterRole = includes(user.groups, exporterGroup);
      const hasOcRole = includes(user.groups, ocGroup);
      const hasReports = includes(user.groups, reportsGroup);
      const hasValidGroupAccess = some(user.groups, g =>
        validGroups.includes(g)
      );
      const props = {
        user,
        helpURL,
        zone,
        onToggleOnboarding,
        onOpenHelp,
      };

      // Don't let OC's to download or invalid group access
      if ((hasOcRole && exporterMode === 'download') || !hasValidGroupAccess) {
        return <Unauthorized />;
      }

      // Load bundle for output checker if that's the only role, otherwise always send exporter
      if (hasReports) {
        el = <Reports />;
      } else if (hasOcRole && !hasExporterRole) {
        el = <OutputChecker {...props} />;
      } else if (hasExporterRole) {
        el = <Exporter {...props} />;
      }
    } else if (authFetchStatus === 'loaded') {
      el = <Unauthorized />;
    }

    return el;
  };

  render() {
    const {
      authFetchStatus,
      isAuthenticated,
      isOnboardingEnabled,
      onToggleOnboarding,
    } = this.props;
    const mainElement = this.renderMain();

    return (
      <LayerManager>
        <SpotlightManager>
          <main id="app-main" className={styles.main}>
            <ReportError />
            <About />
            <Messages />
            <Auth
              fetchStatus={authFetchStatus}
              isAuthenticated={isAuthenticated}
            />
            {mainElement}
          </main>
          <SpotlightTransition>
            <Onboarding
              enabled={isOnboardingEnabled}
              onComplete={onToggleOnboarding}
            />
          </SpotlightTransition>
        </SpotlightManager>
      </LayerManager>
    );
  }
}

App.propTypes = {
  authFetchStatus: PropTypes.string.isRequired,
  fetchToken: PropTypes.func.isRequired,
  helpURL: PropTypes.string,
  initSockets: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isOnboardingEnabled: PropTypes.bool.isRequired,
  onToggleOnboarding: PropTypes.func.isRequired,
  onOpenHelp: PropTypes.func.isRequired,
  user: PropTypes.shape({
    groups: PropTypes.arrayOf(PropTypes.string),
    displayName: PropTypes.string,
  }).isRequired,
  zone: PropTypes.string.isRequired,
};

App.defaultProps = {
  helpURL: null,
};

export default App;
