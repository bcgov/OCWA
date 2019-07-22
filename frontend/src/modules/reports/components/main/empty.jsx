import * as React from 'react';
import TrayIcon from '@atlaskit/icon/glyph/tray';
import { colors } from '@atlaskit/theme';

import * as styles from './styles.css';

function Empty() {
  return (
    <div className={styles.empty}>
      <div>
        <TrayIcon primaryColor={colors.N60} size="xlarge" />
        <h5>There are no requests that match your criteria</h5>
        <p>Try adjusting the date range or request type filter</p>
      </div>
    </div>
  );
}

export default Empty;
