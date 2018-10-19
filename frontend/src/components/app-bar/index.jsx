import * as React from 'react';
import { Link } from 'react-router-dom';

import NewRequest from '@src/modules/requests/containers/new-request';

import * as styles from './styles.css';

function AppBar() {
  return (
    <div className={styles.container}>
      <Link to="/" className={styles.brand}>
        OCWA Export Tool
      </Link>
      <NewRequest />
    </div>
  );
}

export default AppBar;
