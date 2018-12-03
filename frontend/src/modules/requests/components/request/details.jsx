import * as React from 'react';
import { Checkbox } from '@atlaskit/checkbox';
import DynamicTable from '@atlaskit/dynamic-table';
import get from 'lodash/get';

import * as styles from './styles.css';

const head = {
  cells: [
    { key: 'selected', content: '', width: 10 },
    { key: 'name', content: 'File Name', isSortable: true },
    /* { key: 'fileType', content: 'File Type', isSortable: true }, */
    /* { key: 'fileSize', content: 'File Size', isSortable: true }, */
    /* { key: 'modifiedAt', content: 'Date Modified', isSortable: true }, */
    { key: 'fileStatus', content: 'File Status' },
  ],
};
const Empty = <div style={{ marginBottom: 30 }}>No files have been added</div>;

function RequestDetails({ data }) {
  const rows = data.files.map(id => {
    const row = {
      id,
      name: id,
      status: get(data, `fileStatus.${id}`, []),
      selected: false,
    };

    return {
      key: `row-${id}`,
      cells: [
        {
          key: row.selected,
          content: <Checkbox value="Basic checkbox" name="checkbox-basic" />,
        },
        {
          key: row.id,
          content: id,
        },
        {
          key: row.status,
          content: row.status.map(d => d.error).join(','),
        },
      ],
    };
  });

  return (
    <React.Fragment>
      <div className={styles.section}>
        <h4>Purpose</h4>
        <p>{data.purpose}</p>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Export Files</div>
        <div className={styles.sectionContent}>
          <DynamicTable emptyView={Empty} head={head} rows={rows} />
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Support Files</div>
        <div className={styles.sectionContent}>
          <DynamicTable emptyView={Empty} head={head} rows={[]} />
        </div>
      </div>
    </React.Fragment>
  );
}

export default RequestDetails;
