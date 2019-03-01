import * as React from 'react';
import PropTypes from 'prop-types';
import { CreatableSelect } from '@atlaskit/select';
import TextField from '@atlaskit/field-text';

import RequestsList from '../../containers/requests';
import * as styles from './styles.css';

function Dashboard({ filter, onFilterChange, onSearchChange, search }) {
  const filterOptions = [
    { label: 'Show My Requests', value: 'mine' },
    { label: 'Show All Requests', value: 'all' },
    { label: 'Show Unassigned', value: 'unassigned' },
  ];
  const columns = [
    { state: 2, title: 'Available For Review' },
    { state: 3, title: 'In Review' },
    { state: 4, title: 'Approved' },
    { state: 5, title: 'Denied' },
    { state: 6, title: 'Cancelled' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div>
          <CreatableSelect
            id="oc-dashboard-filters-select"
            options={filterOptions}
            placeholder="Filter Requests"
            onChange={({ value }) => onFilterChange(value)}
            value={filterOptions.find(d => d.value === filter)}
          />
        </div>
        <div>
          <TextField
            shouldFitContainer
            isLabelHidden
            id="oc-dashboard-search-input"
            onChange={event => onSearchChange(event.target.value)}
            placeholder="Search export requests..."
            value={search}
          />
        </div>
      </div>
      <div className={styles.board}>
        <div>
          {columns.map(c => (
            <div key={c.state} className={styles.column}>
              <header>
                <h4>{c.title}</h4>
              </header>
              <div className={styles.list}>
                <RequestsList params={{ state: c.state }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Dashboard.propTypes = {
  filter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
};

export default Dashboard;
