import * as React from 'react';

import Card from './card';
import * as styles from './styles.css';

function Dashboard({ data }) {
  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>Toolbar</div>
      <div className={styles.board}>
        <div>
          <div className={styles.column}>
            <header>
              <h4>Unclaimed</h4>
            </header>
            <div className={styles.cardsContainer}>
              <div>{data.map(d => <Card key={d._id} data={d} />)}</div>
            </div>
          </div>
          <div className={styles.column}>
            <header>
              <h4>In Review</h4>
            </header>
          </div>
          <div className={styles.column}>
            <header>
              <h4>Approved</h4>
            </header>
          </div>
          <div className={styles.column}>
            <header>
              <h4>Flagged</h4>
            </header>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
