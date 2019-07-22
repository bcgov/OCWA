import * as React from 'react';
import EditorUnlinkIcon from '@atlaskit/icon/glyph/editor/unlink';
import { colors } from '@atlaskit/theme';

import * as styles from './styles.css';

function NotFound() {
  return (
    <div className={styles.container}>
      <div>
        <EditorUnlinkIcon primaryColor={colors.Y500} size="xlarge" />
        <h2>Page or Resource Not Found</h2>
        <p>
          The page you’re looking for might have been removed, moved, or is
          temporarily unavailable.
        </p>
      </div>
    </div>
  );
}

export default NotFound;
