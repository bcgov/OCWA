import * as React from 'react';
import { Link } from 'react-router-dom';
import DynamicTable from '@atlaskit/dynamic-table';
import PropTypes from 'prop-types';
// Icons
import EditIcon from '@atlaskit/icon/glyph/edit';
import RecentIcon from '@atlaskit/icon/glyph/recent';
import LockIcon from '@atlaskit/icon/glyph/lock';
import MoreIcon from '@atlaskit/icon/glyph/more';

import * as styles from './styles.css';

const head = {
  cells: [
    { key: 'state', content: 'Status', isSortable: true, width: 10 },
    { key: 'name', content: 'Request Identifier', isSortable: true },
  ],
};

const getIcon = state => {
  switch (state) {
    case 0:
      return <EditIcon size="small" />;
    case 1:
      return <RecentIcon />;
    case 2:
      return <LockIcon />;
    default:
      return <MoreIcon />;
  }
};

function RequestsList({ data, isLoading }) {
  const rows = data.map(d => ({
    key: `row-${d._id}`,
    cells: [
      {
        key: d.state,
        content: getIcon(d.state),
      },
      {
        key: d.name,
        content: <Link to={`/requests/${d._id}`}>{d.name}</Link>,
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
