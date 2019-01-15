import * as React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import * as styles from './styles.css';

function AppBar({ children, icon, title }) {
  return (
    <div className={styles.container}>
      <Link id="app-bar-brand" to="/" className={styles.brand}>
        {icon}
        {title}
      </Link>
      <div className={styles.actions}>{children}</div>
    </div>
  );
}

AppBar.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};

AppBar.defaultProps = {
  children: null,
};

export default AppBar;
