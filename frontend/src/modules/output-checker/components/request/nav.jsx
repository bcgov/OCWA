import * as React from 'react';

import RequestCard from '../request-card';
import * as styles from './styles.css';

function RequestsNav({ data }) {
  return (
    <nav className={styles.nav}>
      {data.map(d => <RequestCard key={d._id} data={d} draggable={false} />)}
    </nav>
  );
}

export default RequestsNav;
