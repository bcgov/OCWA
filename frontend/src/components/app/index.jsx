import React from 'react';
import AppBar from '@src/components/app-bar';
import { Switch, Route } from 'react-router-dom';
import Requests from '@src/modules/requests/containers/requests-list';
import '@atlaskit/css-reset';

function App() {
  return (
    <main>
      <AppBar />
      <Switch>
        <Route exact path="/" component={Requests} />
        <Route
          exact
          path="/requests/:requestId"
          render={() => 'Request Page'}
        />
      </Switch>
    </main>
  );
}

export default App;
