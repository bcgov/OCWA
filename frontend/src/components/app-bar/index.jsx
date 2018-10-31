import * as React from 'react';
import Avatar from '@atlaskit/avatar';
import Dropdown, { DropdownItem } from '@atlaskit/dropdown-menu';
import { Link } from 'react-router-dom';
import NewRequest from '@src/modules/requests/containers/new-request';

import * as styles from './styles.css';

function AppBar() {
  return (
    <div className={styles.container}>
      <Link to="/" className={styles.brand}>
        OCWA Export Tool
      </Link>
      <div className={styles.actions}>
        <NewRequest />
        <Dropdown
          position="bottom right"
          trigger={<Avatar borderColor="#0052CC" name="J" />}
        >
          <DropdownItem href="/auth/logout">Logout</DropdownItem>
        </Dropdown>
      </div>
    </div>
  );
}

export default AppBar;
