import * as React from 'react';
import PropTypes from 'prop-types';
// import { Checkbox } from '@atlaskit/checkbox';
import DateTime from '@src/components/date';
import DynamicTable from '@atlaskit/dynamic-table';
import FileIcon from '@src/components/file-icon';
import filesize from 'filesize';
import get from 'lodash/get';

import { FileStatusSchema } from '../../types';
import StatusIcon from './status-icon';
import * as styles from './styles.css';

const Empty = <div className={styles.empty}>No files have been added</div>;
const head = {
  cells: [
    {
      key: 'fileStatus',
      content: <span className={styles.startCell}>File Status</span>,
    },
    // { key: 'selected', content: '', width: 10 },
    {
      key: 'filename',
      content: 'File Name',
      isSortable: true,
    },
    { key: 'filetype', content: 'File Type', isSortable: true, width: 10 },
    { key: 'size', content: 'File Size', isSortable: true, width: 10 },
    {
      key: 'lastmodified',
      content: 'Date Modified',
      isSortable: true,
      width: 20,
    },
  ],
};

function FilesTable({ data, fileStatus }) {
  const rows = data.map(file => {
    const status = get(fileStatus, file.id, []);

    return {
      key: `row-${data.id}`,
      cells: [
        {
          content: (
            <span className={styles.startCell}>
              <StatusIcon data={status} />
            </span>
          ),
        },
        {
          key: file.filename,
          content: (
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <FileIcon type={file.filetype} />
              <span style={{ marginLeft: 10 }}>{file.filename}</span>
            </span>
          ),
        },
        {
          key: file.filetype,
          content: file.filetype,
        },
        {
          key: file.size,
          content: filesize(file.size),
        },
        {
          key: file.lastmodified,
          content: (
            <DateTime
              format="MMM Do, YYYY"
              value={new Date(Number(file.lastmodified))}
            />
          ),
        },
      ],
    };
  });
  return <DynamicTable emptyView={Empty} head={head} rows={rows} />;
}

FilesTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      size: PropTypes.string.isRequired,
      lastmodified: PropTypes.string.isRequired,
      filename: PropTypes.string.isRequired,
      filetype: PropTypes.string.isRequired,
    })
  ).isRequired,
  fileStatus: PropTypes.objectOf(PropTypes.arrayOf(FileStatusSchema)),
};

export default FilesTable;
