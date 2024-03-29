import * as React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
// import { Checkbox } from '@atlaskit/checkbox';
import Button from '@atlaskit/button';
import DateTime from '@src/components/date';
import DynamicTable from '@atlaskit/dynamic-table';
import DocumentIcon from '@atlaskit/icon/glyph/document';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import FileIcon from '@src/components/file-icon';
import filesize from 'filesize';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import SelectClearIcon from '@atlaskit/icon/glyph/select-clear';
import { colors } from '@atlaskit/theme';

import { FileStatusSchema } from '../../types';
import StatusIcon from './status-icon';
import * as styles from './styles.css';

const renderEmpty = (isFailed, isLoaded) => {
  let text = '';

  if (isLoaded) {
    text = <p>No files have been added yet. Edit to add.</p>;
  } else if (isFailed) {
    text = (
      <div>
        <div>
          <ErrorIcon size="xlarge" primaryColor={colors.R500} />
        </div>
        <p>There was an error while requesting your files.</p>
      </div>
    );
  } else {
    text = (
      <div>
        <div>
          <DocumentIcon primaryColor={colors.N70} size="xlarge" />
        </div>
        <div>
          <p>No files have been uploaded.</p>
          <small style={{ color: colors.N70 }}>
            Click <em>Edit Request</em> to upload.
          </small>
        </div>
      </div>
    );
  }

  return (
    <div className={cx(styles.empty, 'request-files-empty-text')}>{text}</div>
  );
};

class FilesTable extends React.Component {
  componentDidUpdate(prevProps) {
    const { id, ids, sendAction } = this.props;

    if (!isEqual(prevProps.ids, ids) && !isEmpty(ids)) {
      sendAction('initialRequest', { id, ids });
    }
  }

  render() {
    const {
      data,
      id,
      isLoading,
      isLoaded,
      isFailed,
      fileStatus,
      onRemove,
      showDownloadButton,
      showRemoveButton,
    } = this.props;
    // Keep head in the render method so we can dynamically add remove
    const head = {
      cells: [
        // { key: 'selected', content: '', width: 10 },
        {
          key: 'fileStatus',
          shouldTruncate: true,
          content: '',
        },
        {
          key: 'fileName',
          content: 'File Name',
          isSortable: true,
          shouldTruncate: true,
        },
        { key: 'fileType', content: 'File Type', isSortable: true, width: 10 },
        { key: 'size', content: 'File Size', isSortable: true, width: 10 },
        {
          key: 'lastModified',
          content: 'Date Modified',
          isSortable: true,
          width: 20,
        },
      ],
    };

    const rows = data.map(file => {
      const status = get(fileStatus, file.id, []);

      const row = {
        key: `row-${data.id}`,
        cells: [
          {
            content: (
              <div className={styles.startCell}>
                <StatusIcon data={status} />
              </div>
            ),
          },
          {
            key: file.fileName,
            content: (
              <div
                className="request-files-file-name"
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <FileIcon type={file.fileType} />
                <span style={{ marginLeft: 10 }}>
                  {file.fileName || 'File not found'}
                </span>
              </div>
            ),
          },
          {
            key: file.fileType,
            content: file.fileType || file.contentType || 'unknown',
          },
          {
            key: file.size,
            content: filesize(file.size || 0),
          },
          {
            key: file.lastModified,
            content: (
              <DateTime
                format="MMM Do, YYYY"
                value={new Date(Number(file.lastModified))}
              />
            ),
          },
        ],
      };

      if (showDownloadButton) {
        row.cells.push({
          key: file.id,
          content: (
            <div
              className={cx(
                styles.downloadButton,
                'request-file-download-button'
              )}
            >
              <Button
                download
                appearance="subtle"
                spacing="none"
                href={`/api/v1/files/${file.id}?request_id=${id}`}
                iconBefore={<DownloadIcon />}
              />
            </div>
          ),
        });
      }

      if (showRemoveButton) {
        row.cells.push({
          key: file.id,
          content: (
            <div className={styles.removeButton}>
              <Button
                appearance="subtle"
                spacing="none"
                iconBefore={<SelectClearIcon />}
                onClick={() => onRemove(file.id)}
              />
            </div>
          ),
        });
      }

      return row;
    });

    if (showRemoveButton) {
      head.cells.push({
        key: 'remove',
        content: '',
        width: 5,
      });
    }

    return (
      <div className={styles.container}>
        <DynamicTable
          emptyView={renderEmpty(isFailed, isLoaded)}
          isLoading={isLoading}
          head={head}
          rows={rows}
        />
      </div>
    );
  }
}

FilesTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      lastModified: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      fileName: PropTypes.string.isRequired,
      fileType: PropTypes.string.isRequired,
    })
  ).isRequired,
  fileStatus: PropTypes.objectOf(PropTypes.arrayOf(FileStatusSchema)),
  id: PropTypes.string.isRequired,
  ids: PropTypes.arrayOf(PropTypes.string).isRequired,
  isLoading: PropTypes.bool.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  isFailed: PropTypes.bool.isRequired,
  sendAction: PropTypes.func.isRequired,
  showDownloadButton: PropTypes.bool,
  showRemoveButton: PropTypes.bool,
  onRemove: PropTypes.func,
};

FilesTable.defaultProps = {
  fileStatus: {},
  showDownloadButton: false,
  showRemoveButton: false,
  onRemove: () => null,
};

export default FilesTable;
