import * as React from 'react';
import { Link } from 'react-router-dom';
import { DynamicTableStateless } from '@atlaskit/dynamic-table';

import * as styles from './styles.css';

const head = {
  cells: [
    { key: 'state', content: 'Status', isSortable: true },
    { key: 'name', content: 'Request Identifier', isSortable: true },
  ],
};

function RequestsList({ data, isLoading }) {
  const rows = data.map(d => ({
    key: `row-${d._id}`,
    cells: [
      {
        key: 'state',
        content: d.state,
      },
      {
        key: 'name',
        content: <Link to={`/requests/${d._id}`}>{d.name}</Link>,
      },
    ],
  }));
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <DynamicTableStateless
          emptyView={<h2>No requests yet</h2>}
          head={head}
          rows={rows}
          loadingSpinnerSize="large"
          isLoading={isLoading}
          sortKey="state"
          sortOrder="DESC"
        />
      </div>
    </div>
  );
}

RequestsList.defaultProps = {
  data: [],
};

export default RequestsList;
