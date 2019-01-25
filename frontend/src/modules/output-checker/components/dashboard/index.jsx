import * as React from 'react';
import PropTypes from 'prop-types';
import { CreatableSelect } from '@atlaskit/select';
import TextField from '@atlaskit/field-text';

import RequestsList from '../../containers/requests';
import * as styles from './styles.css';

function Dashboard({ filter, onFilterChange, onSearchChange, search }) {
  const filterOptions = [
    { label: 'Show All Requests', value: 'all' },
    { label: 'Show My Requests', value: 'mine' },
    { label: 'Show Unassigned', value: 'unassigned' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div>
          <CreatableSelect
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
            onChange={event => onSearchChange(event.target.value)}
            placeholder="Search export requests..."
            value={search}
          />
        </div>
      </div>
      <div className={styles.board}>
        <div>
          <div className={styles.column}>
            <header>
              <h4>Submitted</h4>
            </header>
            <div className={styles.cardsContainer}>
              <div>
                <RequestsList params={{ state: 2 }} />
              </div>
            </div>
          </div>
          <div className={styles.column}>
            <header>
              <h4>In Review</h4>
            </header>
            <div className={styles.cardsContainer}>
              <div>
                <RequestsList params={{ state: 3 }} />
              </div>
            </div>
          </div>
          <div className={styles.column}>
            <header>
              <h4>Approved</h4>
            </header>
            <div className={styles.cardsContainer}>
              <div>
                <RequestsList params={{ state: 4 }} />
              </div>
            </div>
          </div>
          <div className={styles.column}>
            <header>
              <h4>Denied</h4>
            </header>
            <div className={styles.cardsContainer}>
              <div>
                <RequestsList params={{ state: 5 }} />
              </div>
            </div>
          </div>
          <div className={styles.column}>
            <header>
              <h4>Cancelled</h4>
            </header>
            <div className={styles.cardsContainer}>
              <div>
                <RequestsList params={{ state: 6 }} />
              </div>
            </div>
          </div>
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
