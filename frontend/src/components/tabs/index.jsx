import * as React from 'react';
import PropTypes from 'prop-types';

import * as styles from './styles.css';

function Tabs({ children }) {
  return <nav className={styles.container}>{children}</nav>;
}

Tabs.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Tabs;
