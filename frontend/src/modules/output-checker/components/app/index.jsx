import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@src/components/app-bar';
import Avatar from '@atlaskit/avatar';
import Dropdown, { DropdownItem } from '@atlaskit/dropdown-menu';
import Issue24Icon from '@atlaskit/icon-object/glyph/issue/24';
import Request from '@src/modules/requests/containers/request';
import { Switch, Route } from 'react-router-dom';

import Dashboard from '../../containers/dashboard';
import * as styles from './styles.css';

function App({ user }) {
  return (
    <React.Fragment>
      <AppBar icon={<Issue24Icon />} title="OCWA Output Checker">
        <Dropdown
          position="bottom right"
          trigger={<Avatar borderColor="#0052CC" name={user.displayName} />}
        >
          <DropdownItem>{`Howdy, ${user.displayName}`}</DropdownItem>
          <DropdownItem href="/auth/logout">Logout</DropdownItem>
        </Dropdown>
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
  user: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
  }).isRequired,
};

export default App;
