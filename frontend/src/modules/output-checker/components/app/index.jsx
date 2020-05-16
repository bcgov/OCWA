import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@src/components/app-bar';
import AppBarMenu from '@src/components/app-bar/menu';
import HelpDialog from '@src/modules/help/containers/help-dialog';
import Issue24Icon from '@atlaskit/icon-object/glyph/issue/24';
import { Switch, Route } from 'react-router-dom';
import NotFound from '@src/components/not-found';
import Title from '@src/components/title';
import { ocGroup } from '@src/services/config';

import Dashboard from '../../containers/dashboard';
import Request from '../../containers/request';
import * as styles from './styles.css';

function App({ onOpenHelp, user }) {
  return (
    <React.Fragment>
      <Title>Output Checker</Title>
      <HelpDialog type={ocGroup} />
      <AppBar icon={<Issue24Icon />} title="OCWA Output Checker">
        <AppBarMenu onOpenHelp={onOpenHelp} user={user} />
      </AppBar>
      <div id="app-content" className={styles.container}>
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/requests/:requestId" component={Request} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </React.Fragment>
  );
}

App.propTypes = {
  onOpenHelp: PropTypes.func.isRequired,
  user: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
  }).isRequired,
};

export default App;
