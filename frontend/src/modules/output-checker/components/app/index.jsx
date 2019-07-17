import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@src/components/app-bar';
import AppBarMenu from '@src/components/app-bar/menu';
import Issue24Icon from '@atlaskit/icon-object/glyph/issue/24';
import { Switch, Route } from 'react-router-dom';
import Title from '@src/components/title';

import Dashboard from '../../containers/dashboard';
import Request from '../../containers/request';
import * as styles from './styles.css';

function App({ helpURL, user }) {
  return (
    <React.Fragment>
      <AppBar icon={<Issue24Icon />} title="OCWA Output Checker">
        <AppBarMenu helpURL={helpURL} user={user} />
      </AppBar>
      <div id="app-content" className={styles.container}>
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/requests/:requestId" component={Request} />
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
