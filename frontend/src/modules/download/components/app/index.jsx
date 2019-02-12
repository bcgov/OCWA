import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@src/components/app-bar';
import AppBarMenu from '@src/components/app-bar/menu';
import Changes24Icon from '@atlaskit/icon-object/glyph/changes/24';
import Request from '@src/modules/requests/containers/request';
import RequestForm from '@src/modules/requests/containers/request-form';
import { Switch, Route } from 'react-router-dom';

import Requests from '../../containers/requests';

import * as styles from './styles.css';

function App({ user }) {
  return (
    <React.Fragment>
      <RequestForm />
      <AppBar icon={<Changes24Icon />} title="OCWA Exporter Download Centre">
        <AppBarMenu user={user} />
      </AppBar>
      <div id="app-content" className={styles.container}>
        <Switch>
          <Route exact path="/" component={Requests} />
          <Route path="/requests/:requestId" component={Request} />
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
