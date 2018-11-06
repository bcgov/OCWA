import React from 'react';
import AppBar from '@src/components/app-bar';
import Avatar from '@atlaskit/avatar';
import Dropdown, { DropdownItem } from '@atlaskit/dropdown-menu';
import NewRequest from '@src/modules/requests/containers/new-request';
import Requests from '@src/modules/requests/containers/requests-list';
import RequestForm from '@src/modules/requests/containers/request-form';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import '@atlaskit/css-reset';

import Auth from '../auth';

class App extends React.Component {
  componentDidMount() {
    this.props.fetchToken();
  }

  render() {
    const { authFetchStatus, isAuthenticated, user } = this.props;

    return (
      <main>
        <Auth fetchStatus={authFetchStatus} isAuthenticated={isAuthenticated} />
        {isAuthenticated && (
          <React.Fragment>
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
            <Switch>
              <Route exact path="/" component={Requests} />
              <Route
                exact
                path="/requests/:requestId"
                render={() => 'Request Page'}
              />
              <Route render={() => '404'} />
            </Switch>
          </React.Fragment>
        )}
      </main>
    );
  }
}

App.propTypes = {
  authFetchStatus: PropTypes.string.isRequired,
  fetchToken: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    displayName: PropTypes.string,
  }).isRequired,
};

export default App;
