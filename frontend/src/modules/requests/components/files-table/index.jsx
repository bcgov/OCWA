import * as React from 'react';
import PropTypes from 'prop-types';
// import { Checkbox } from '@atlaskit/checkbox';
import Button from '@atlaskit/button';
import DateTime from '@src/components/date';
import DynamicTable from '@atlaskit/dynamic-table';
import FileIcon from '@src/components/file-icon';
import filesize from 'filesize';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import get from 'lodash/get';
import SelectClearIcon from '@atlaskit/icon/glyph/select-clear';
import { colors } from '@atlaskit/theme';

import { FileStatusSchema } from '../../types';
import StatusIcon from './status-icon';
import * as styles from './styles.css';

const renderEmpty = isFailed => {
  let text = <p>No files have been added yet. Edit to add.</p>;

  if (isFailed) {
    text = (
      <div>
        <div>
          <ErrorIcon size="xlarge" primaryColor={colors.R500} />
        </div>
        <p>There was an error while requesting your files.</p>
      </div>
    );
  }

  return <div className={styles.empty}>{text}</div>;
};
function FilesTable({
  data,
  isLoading,
  isFailed,
  fileStatus,
  onRemove,
  showRemoveButton,
}) {
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
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FileIcon type={file.fileType} />
              <span style={{ marginLeft: 10 }}>{file.fileName}</span>
            </div>
          ),
        },
        {
          key: file.fileType,
          content: file.fileType,
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
    <DynamicTable
      emptyView={renderEmpty(isFailed)}
      isLoading={isLoading}
      head={head}
      rows={rows}
    />
  );
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
  isLoading: PropTypes.bool.isRequired,
  isFailed: PropTypes.bool.isRequired,
  showRemoveButton: PropTypes.bool,
  onRemove: PropTypes.func,
};

FilesTable.defaultProps = {
  fileStatus: {},
  showRemoveButton: false,
  onRemove: () => null,
};

export default FilesTable;
