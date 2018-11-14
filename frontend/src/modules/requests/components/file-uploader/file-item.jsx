import * as React from 'react';
import FileIcon from '@src/components/file-icon';
import ArrowUpCircleIcon from '@atlaskit/icon/glyph/arrow-up-circle';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import ErrorIcon from '@atlaskit/icon/glyph/jira/failed-build-status';
import { colors } from '@atlaskit/theme';

import { FileSchema } from '../../types';
import * as styles from './styles.css';

function FileItem({ data }) {
  return (
    <div key={data.id} className={styles.fileItem}>
      <div className={styles.fileItemIcon}>
        <FileIcon type={data.filetype} />
      </div>
      <div className={styles.fileItemName}>{data.filename}</div>
      <div className={styles.fileItemSize}>
        {data.state === 'loading' && `${data.progress}% of `}
        {data.size}
      </div>
      <div className={styles.fileItemState}>Uploaded</div>
      <div className={styles.fileItemStatusIcon}>
        <CheckCircleIcon primaryColor={colors.G500} />
      </div>
    </div>
  );
}

FileItem.propTypes = {
  data: FileSchema.isRequired,
};

export default FileItem;
