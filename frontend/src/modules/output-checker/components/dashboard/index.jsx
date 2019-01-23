import * as React from 'react';
import Select from '@atlaskit/select';
import TextField from '@atlaskit/field-text';

import RequestsList from '../../containers/requests';
import Card from '../request-card';
import * as styles from './styles.css';

function Dashboard() {
  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div>
          <Select
            options={[
              { label: 'Show All Requests' },
              { label: 'Show My Requests' },
              { label: 'Show Unassigned' },
            ]}
            placeholder="Display: Show All Requests"
          />
        </div>
        <div>
          <TextField
            shouldFitContainer
            isLabelHidden
            placeholder="Search export requests..."
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

export default Dashboard;
