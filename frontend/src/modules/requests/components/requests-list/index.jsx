import * as React from 'react';
import { Link } from 'react-router-dom';
import DynamicTable from '@atlaskit/dynamic-table';
import PropTypes from 'prop-types';

import RequestIcon from '../request-icon';
import * as styles from './styles.css';

const head = {
  cells: [
    { key: 'state', content: 'Status', isSortable: true, width: 10 },
    { key: 'name', content: 'Request Identifier', isSortable: true },
  ],
};

function RequestsList({ data, isLoading, onSelect }) {
  const rows = data.map(d => ({
    key: `row-${d._id}`,
    cells: [
      {
        key: d.state,
        content: <RequestIcon value={d.state} />,
      },
      {
        key: d.name,
        content:
          d.state < 2 ? (
            <a
              href="#"
              onClick={event => {
                event.preventDefault();
                onSelect(d._id);
              }}
            >
              {d.name}
            </a>
          ) : (
            <Link to={`/requests/${d._id}`}>{d.name}</Link>
          ),
      },
    ],
  }));

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <DynamicTable
          emptyView={<h2>No requests yet</h2>}
          head={head}
          rows={rows}
          loadingSpinnerSize="large"
          isLoading={isLoading}
          defaultSortKey="state"
          defaultSortOrder="DESC"
        />
      </div>
    </div>
  );
}

RequestsList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      state: PropTypes.number,
    })
  ),
  isLoading: PropTypes.bool.isRequired,
};

RequestsList.defaultProps = {
  data: [],
};

export default RequestsList;
