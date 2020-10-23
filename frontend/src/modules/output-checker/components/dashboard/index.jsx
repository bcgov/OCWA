import * as React from 'react';
import PropTypes from 'prop-types';
import { CreatableSelect } from '@atlaskit/select';
import { SpotlightTarget } from '@atlaskit/onboarding';
import TextField from '@atlaskit/field-text';
import Title from '@src/components/title';

import RequestsList from '../../containers/requests';
import * as styles from './styles.css';

function Dashboard({ filter, onFilterChange, onSearchChange, search }) {
  const filterOptions = [
    { label: 'Show My Requests', value: 'mine' },
    { label: 'Show All Requests', value: 'all' },
    { label: 'Show Unassigned', value: 'unassigned' },
  ];
  const columns = [
    { state: 1, title: 'In Progress' },
    { state: 2, title: 'Available For Review' },
    { state: 3, title: 'In Review' },
    { state: 4, title: 'Approved' },
    { state: 5, title: 'Denied' },
    { state: 6, title: 'Cancelled' },
  ];

  return (
    <div className={styles.container}>
      <Title>Dashboard</Title>
      <div className={styles.toolbar}>
        <div>
          <SpotlightTarget name="home-filters">
            <CreatableSelect
              id="oc-dashboard-filters-select"
              options={filterOptions}
              placeholder="Filter Requests"
              onChange={({ value }) => onFilterChange(value)}
              value={filterOptions.find(d => d.value === filter)}
            />
          </SpotlightTarget>
        </div>
        <div>
          <SpotlightTarget name="home-search">
            <TextField
              shouldFitContainer
              isLabelHidden
              id="oc-dashboard-search-input"
              onChange={event => onSearchChange(event.target.value)}
              placeholder="Search export requests..."
              value={search}
            />
          </SpotlightTarget>
        </div>
      </div>
      <div className={styles.board}>
        <div>
          {columns.map((c, index) => (
            <div key={c.state} className={styles.column}>
              {index === 0 && (
                <SpotlightTarget name="home-columns">
                  <header>
                    <h4>{c.title}</h4>
                  </header>
                </SpotlightTarget>
              )}
              {index > 0 && (
                <header>
                  <h4>{c.title}</h4>
                </header>
              )}
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
