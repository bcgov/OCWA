import * as React from 'react';

import * as styles from './styles.css';

function Request({ data }) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>{data.name}</h1>
      </header>
    </div>
  );
}

export default Request;
