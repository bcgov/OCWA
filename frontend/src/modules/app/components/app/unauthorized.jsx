import * as React from 'react';
import LockCircleIcon from '@atlaskit/icon/glyph/lock-circle';

import * as styles from './styles.css';

function Unauthorized() {
  return (
    <div className={styles.splashContainer}>
      <div>
        <LockCircleIcon size="xlarge" secondaryColor="#036" />
        <h2>You are not authorized to view this page</h2>
        <small>
          Please contact your administrator if you feel this is an error
        </small>
      </div>
    </div>
  );
}

export default Unauthorized;
