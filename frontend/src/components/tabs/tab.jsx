import * as React from 'react';
import { NavLink } from 'react-router-dom';

import * as styles from './styles.css';

function Tab({ icon, text, url }) {
  return (
    <NavLink
      exact
      activeClassName={styles.tabActive}
      className={styles.tab}
      id="request-details-tab"
      to={url}
    >
      <span className={styles.icon}>{icon}</span>
      {text}
    </NavLink>
  );
}

export default Tab;
