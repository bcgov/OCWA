import * as React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import FileIcon from '@src/components/file-icon';
import ArrowUpCircleIcon from '@atlaskit/icon/glyph/arrow-up-circle';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import ErrorIcon from '@atlaskit/icon/glyph/jira/failed-build-status';
import filesize from 'filesize';
import Spinner from '@atlaskit/spinner';
import startCase from 'lodash/startCase';
import { colors } from '@atlaskit/theme';

import { FileSchema } from '../../types';
import * as styles from './styles.css';

function FileItem({ data, progress, uploadStatus }) {
  return (
    <div key={data.id} className={cx('file-item', styles.fileItem)}>
      <div className={styles.fileItemIcon}>
        <FileIcon type={data.filetype} />
      </div>
      <div className={styles.fileItemName}>{data.filename}</div>
      <div className={styles.fileItemSize}>
        {uploadStatus === 'uploading' && `${progress}% of `}
        {filesize(data.size)}
      </div>
      <div className={styles.fileItemState}>{startCase(uploadStatus)}</div>
      <div className={styles.fileItemStatusIcon}>
        {uploadStatus === 'queued' && <Spinner />}
        {uploadStatus === 'uploading' && (
          <ArrowUpCircleIcon primaryColor={colors.B500} />
        )}
        {uploadStatus === 'failed' && <ErrorIcon primaryColor={colors.R500} />}
        {uploadStatus === 'loaded' && (
          <CheckCircleIcon primaryColor={colors.G500} />
        )}
      </div>
    </div>
  );
}

FileItem.propTypes = {
  data: FileSchema.isRequired,
  progress: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  uploadStatus: PropTypes.oneOf(['queued', 'loaded', 'failed', 'uploading'])
    .isRequired,
};

export default FileItem;
