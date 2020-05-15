import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@src/components/app-bar';
import AppBarMenu from '@src/components/app-bar/menu';
import { ButtonGroup } from '@atlaskit/button';
import Changes24Icon from '@atlaskit/icon-object/glyph/changes/24';
import Downloads from '@src/modules/download/containers/requests';
import HelpDialog from '@src/modules/help/containers/help-dialog';
import NewRequest from '@src/modules/requests/containers/new-request';
import NotFound from '@src/components/not-found';
import RequestForm from '@src/modules/requests/containers/request-form';
import Requests from '@src/modules/requests/containers/requests-list';
import RequestTypes from '@src/modules/download/containers/request-types';
import Request from '@src/modules/requests/containers/request';
import { SpotlightTarget } from '@atlaskit/onboarding';
import { Switch, Route } from 'react-router-dom';
import Title from '@src/components/title';

import DownloadsLink from './downloads-link';
import * as styles from './styles.css';

function App({ onOpenHelp, onToggleOnboarding, user, zone }) {
  return (
    <React.Fragment>
      <Title>Exporter</Title>
      <HelpDialog type="exporter" />
      <AppBar icon={<Changes24Icon />} title="OCWA">
        <ButtonGroup>
          <SpotlightTarget name="home-approved-requests">
            <DownloadsLink zone={zone} />
          </SpotlightTarget>
          <NewRequest />
        </ButtonGroup>
        <AppBarMenu
          onToggleOnboarding={onToggleOnboarding}
          onOpenHelp={onOpenHelp}
          user={user}
        />
      </AppBar>
      <div id="app-content" className={styles.container}>
        <Switch>
          <Route exact path="/" component={Requests} />
          <Route path="/requests/:requestId" component={Request} />
          <Route path="/new" component={RequestForm} />
          <Route
            path="/downloads"
            render={props => (
              <RequestTypes>
                <Downloads {...props} />
              </RequestTypes>
            )}
          />
          <Route component={NotFound} />
        </Switch>
      </div>
    </React.Fragment>
  );
}

App.propTypes = {
  onOpenHelp: PropTypes.func.isRequired,
  onToggleOnboarding: PropTypes.func.isRequired,
  user: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
  }).isRequired,
  zone: PropTypes.string.isRequired,
};

App.defaultProps = {
  helpURL: null,
};

export default App;
