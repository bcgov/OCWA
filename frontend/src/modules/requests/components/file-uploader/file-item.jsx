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
  const isQueued = uploadStatus === 'queued';
  const isUploading = uploadStatus === 'uploading';
  const isFailed = uploadStatus === 'failed';
  const isLoaded = uploadStatus === 'loaded';

  return (
    <div key={data.id} className={cx('file-item', styles.fileItem)}>
      <div
        className={cx(styles.fileItemStatusIcon, {
          'file-item-queued-icon': isQueued,
          'file-item-uploading-icon': isUploading,
          'file-item-failed-icon': isFailed,
          'file-item-loaded-icon': isLoaded,
        })}
      >
        {isQueued && <Spinner />}
        {isUploading && <ArrowUpCircleIcon primaryColor={colors.B500} />}
        {isFailed && <ErrorIcon primaryColor={colors.R500} />}
        {isLoaded && <CheckCircleIcon primaryColor={colors.G500} />}
      </div>
      <div className={styles.fileItemIcon}>
        <FileIcon type={data.fileType} />
      </div>
      <div className={styles.fileItemName}>{data.fileName}</div>
      <div className={styles.fileItemSize}>
        {startCase(uploadStatus)}{' '}
        {isUploading && `${Math.round(progress)}% of `}
        {filesize(data.size || 0)}
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
