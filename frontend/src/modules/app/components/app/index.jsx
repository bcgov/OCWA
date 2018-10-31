import React from 'react';
import AppBar from '@src/components/app-bar';
import { Switch, Route } from 'react-router-dom';
import Requests from '@src/modules/requests/containers/requests-list';
import '@atlaskit/css-reset';

import Auth from '../auth';

class App extends React.Component {
  componentDidMount() {
    this.props.fetchToken();
  }

  render() {
    const { authFetchStatus, isAuthenticated } = this.props;

    return (
      <main>
        <Auth fetchStatus={authFetchStatus} isAuthenticated={isAuthenticated} />
        {isAuthenticated && (
          <React.Fragment>
            <AppBar />
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

export default App;
