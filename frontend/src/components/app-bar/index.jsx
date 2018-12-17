import * as React from 'react';
import { Link } from 'react-router-dom';
import AppIcon from '@atlaskit/icon/glyph/jira/labs';
import PropTypes from 'prop-types';

import * as styles from './styles.css';

function AppBar({ children, title }) {
  return (
    <div className={styles.container}>
      <Link id="app-bar-brand" to="/" className={styles.brand}>
        <AppIcon size="large" />
        {title}
      </Link>
      <div className={styles.actions}>{children}</div>
    </div>
  );
}

AppBar.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

AppBar.defaultProps = {
  children: null,
};

export default AppBar;
