import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@src/components/app-bar';
import AppBarMenu from '@src/components/app-bar/menu';
import Changes24Icon from '@atlaskit/icon-object/glyph/changes/24';
import { Switch, Route } from 'react-router-dom';
import NotFound from '@src/components/not-found';
import Title from '@src/components/title';

import Reports from '../../containers/main';
import Request from '../../containers/request';
import * as styles from './styles.css';

function ReportsApp({ user }) {
  return (
    <React.Fragment>
      <Title>Reports</Title>
      <AppBar icon={<Changes24Icon />} title="OCWA Reports">
        <AppBarMenu user={user} />
      </AppBar>
      <div id="app-content" className={styles.container}>
        <Switch>
          <Route exact path="/" component={Reports} />
          <Route exact path="/view/:requestId" component={Request} />
          <Route componet={NotFound} />
        </Switch>
      </div>
    </React.Fragment>
  );
}

ReportsApp.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
  }).isRequired,
};

export default ReportsApp;
