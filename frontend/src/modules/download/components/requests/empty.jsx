import * as React from 'react';
import TrayIcon from '@atlaskit/icon/glyph/tray';

const renderEmpty = zone => (
  <div>
    <div>
      <TrayIcon primaryColor="#e3e3e3" size="xlarge" />
    </div>
    <h3>There are no approved requests</h3>
    <p>
      You can reach out to the <strong>Output Checker</strong> via the{' '}
      <i>Discussion</i> tab if needed to discuss the {zone} request.
    </p>
  </div>
);

export default renderEmpty;
