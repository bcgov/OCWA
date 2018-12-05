import React from 'react';
import AppBar from '@src/components/app-bar';
import Avatar from '@atlaskit/avatar';
import Dropdown, { DropdownItem } from '@atlaskit/dropdown-menu';
import LayerManager from '@atlaskit/layer-manager';
import Messages from '@src/modules/data/containers/messages';
import NewRequest from '@src/modules/requests/containers/new-request';
import Requests from '@src/modules/requests/containers/requests-list';
import Request from '@src/modules/requests/containers/request';
import RequestForm from '@src/modules/requests/containers/request-form';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import '@atlaskit/css-reset';

import Auth from '../auth';
import * as styles from './styles.css';

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

  render() {
    const { authFetchStatus, isAuthenticated, user } = this.props;

    return (
      <LayerManager>
        <main id="app-main" className={styles.main}>
          <Auth
            fetchStatus={authFetchStatus}
            isAuthenticated={isAuthenticated}
          />
          {isAuthenticated && (
            <React.Fragment>
              <Messages />
              <RequestForm />
              <AppBar title="OCWA Export Tool">
                <NewRequest />
                <Dropdown
                  position="bottom right"
                  trigger={
                    <Avatar borderColor="#0052CC" name={user.displayName} />
                  }
                >
                  <DropdownItem>{`Howdy, ${user.displayName}`}</DropdownItem>
                  <DropdownItem href="/auth/logout">Logout</DropdownItem>
                </Dropdown>
              </AppBar>
              <div id="app-content" className={styles.container}>
                <Switch>
                  <Route exact path="/" component={Requests} />
                  <Route path="/requests/:requestId" component={Request} />
                  <Route render={() => '404'} />
                </Switch>
              </div>
            </React.Fragment>
          )}
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
