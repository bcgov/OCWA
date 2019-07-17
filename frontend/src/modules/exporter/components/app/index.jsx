import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@src/components/app-bar';
import AppBarMenu from '@src/components/app-bar/menu';
import { ButtonGroup } from '@atlaskit/button';
import Changes24Icon from '@atlaskit/icon-object/glyph/changes/24';
import Downloads from '@src/modules/download/containers/requests';
import NewRequest from '@src/modules/requests/containers/new-request';
import RequestForm from '@src/modules/requests/containers/request-form';
import Requests from '@src/modules/requests/containers/requests-list';
import RequestTypes from '@src/modules/download/containers/request-types';
import Request from '@src/modules/requests/containers/request';
import { Switch, Route } from 'react-router-dom';
import Title from '@src/components/title';

import DownloadsLink from './downloads-link';
import * as styles from './styles.css';

function App({ helpURL, user }) {
  return (
    <React.Fragment>
      <Title>Exporter</Title>
      <AppBar icon={<Changes24Icon />} title="OCWA Exporter Tool">
        <ButtonGroup>
          <DownloadsLink />
          <NewRequest />
        </ButtonGroup>
        <AppBarMenu helpURL={helpURL} user={user} />
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
          <Route render={() => '404'} />
        </Switch>
      </div>
    </React.Fragment>
  );
}

App.propTypes = {
  helpURL: PropTypes.string,
  user: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
  }).isRequired,
};

App.defaultProps = {
  helpURL: null,
};

export default App;
