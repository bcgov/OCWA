import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import cx from 'classnames';
import CheckIcon from '@atlaskit/icon/glyph/check';
import FileIcon from '@src/components/file-icon';
import ArrowUpCircleIcon from '@atlaskit/icon/glyph/arrow-up-circle';
import ErrorIcon from '@atlaskit/icon/glyph/jira/failed-build-status';
import filesize from 'filesize';
import Spinner from '@atlaskit/spinner';
import startCase from 'lodash/startCase';
import EmojiFrequentIcon from '@atlaskit/icon/glyph/emoji/frequent';
import { colors } from '@atlaskit/theme';

import { FileSchema } from '../../types';
import * as styles from './styles.css';

function FileItem({ data, filesKey, id, onRemove, progress, uploadStatus }) {
  const isQueued = uploadStatus === 'queued';
  const isUploading = uploadStatus === 'uploading';
  const isFailed = uploadStatus === 'failed';
  const isUploaded = uploadStatus === 'uploaded';
  const isLoaded = uploadStatus === 'loaded';

  return (
    <div key={data.id} className={cx('file-item', styles.fileItem)}>
      <div
        className={cx(styles.fileItemStatusIcon, {
          'file-item-queued-icon': isQueued,
          'file-item-uploading-icon': isUploading,
          'file-item-failed-icon': isFailed,
          'file-item-loaded-icon': isUploaded,
        })}
      >
        {isQueued && <Spinner />}
        {isUploading && <ArrowUpCircleIcon primaryColor={colors.B500} />}
        {isFailed && <ErrorIcon primaryColor={colors.R500} />}
        {isUploaded && <CheckIcon primaryColor={colors.G500} />}
        {isLoaded && <EmojiFrequentIcon primaryColor={colors.B500} />}
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
      {(isLoaded || isUploaded) && (
        <div className={styles.fileItemRemoveButton}>
          <Button
            appearance="subtle"
            iconBefore={<CrossCircleIcon />}
            spacing="compact"
            onClick={() => onRemove(id, filesKey)}
          />
        </div>
      )}
    </div>
  );
}

FileItem.propTypes = {
  data: FileSchema.isRequired,
  id: PropTypes.string.isRequired,
  filesKey: PropTypes.oneOf(['files', 'supportingFiles']).isRequired,
  onRemove: PropTypes.func.isRequired,
  progress: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  uploadStatus: PropTypes.oneOf([
    'queued',
    'loaded',
    'failed',
    'uploading',
    'uploaded',
  ]).isRequired,
};

export default FileItem;
