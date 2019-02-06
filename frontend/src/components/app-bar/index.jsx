import * as React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Tooltip from '@atlaskit/tooltip';
import { commit, version } from '@src/services/config';

import * as styles from './styles.css';

function AppBar({ children, icon, title }) {
  return (
    <div className={styles.container}>
      <Tooltip content={`OCWA Version ${version}:${commit}`}>
        <Link id="app-bar-brand" to="/" className={styles.brand}>
          {icon}
          {title}
          <small>{`v${version}`}</small>
        </Link>
      </Tooltip>
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
