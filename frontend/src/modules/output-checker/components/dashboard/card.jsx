import * as React from 'react';

import * as styles from './styles.css';

function Card({ data }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardName}>{data.name}</div>
      <div className={styles.cardDetailsRow}>
        <small>{data.author}</small>
        <small>{data.files.length} Exports</small>
      </div>
      <div>
        <small>{data.reviewers.length > 0 ? 'Assigned' : 'Unclaimed'}</small>
      </div>
    </div>
  );
}

export default Card;
