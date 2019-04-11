import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@src/components/app-bar';
import AppBarMenu from '@src/components/app-bar/menu';
import Changes24Icon from '@atlaskit/icon-object/glyph/changes/24';
import NewRequest from '@src/modules/requests/containers/new-request';
import RequestForm from '@src/modules/requests/containers/request-form';
import Requests from '@src/modules/requests/containers/requests-list';
import Request from '@src/modules/requests/containers/request';
import { Switch, Route } from 'react-router-dom';
import Title from '@src/components/title';

import * as styles from './styles.css';

function App({ user }) {
  return (
    <React.Fragment>
      <Title>Exporter</Title>
      <AppBar icon={<Changes24Icon />} title="OCWA Exporter Tool">
        <NewRequest />
        <AppBarMenu user={user} />
      </AppBar>
      <div id="app-content" className={styles.container}>
        <Switch>
          <Route exact path="/" component={Requests} />
          <Route path="/requests/:requestId" component={Request} />
          <Route path="/new" component={RequestForm} />
          <Route render={() => '404'} />
        </Switch>
      </div>
    </React.Fragment>
  );
}

App.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
  }).isRequired,
};

export default App;
