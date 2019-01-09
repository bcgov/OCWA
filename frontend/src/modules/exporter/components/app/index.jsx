import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@src/components/app-bar';
import Avatar from '@atlaskit/avatar';
import Changes24Icon from '@atlaskit/icon-object/glyph/changes/24';
import Dropdown, { DropdownItem } from '@atlaskit/dropdown-menu';
import NewRequest from '@src/modules/requests/containers/new-request';
import Requests from '@src/modules/requests/containers/requests-list';
import Request from '@src/modules/requests/containers/request';
import RequestForm from '@src/modules/requests/containers/request-form';
import { Switch, Route } from 'react-router-dom';

import * as styles from './styles.css';

function App({ user }) {
  return (
    <React.Fragment>
      <RequestForm />
      <AppBar icon={<Changes24Icon />} title="OCWA Exporter Tool">
        <NewRequest />
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
