import * as React from 'react';
import PropTypes from 'prop-types';
import Spinner from '@atlaskit/spinner';

import * as styles from './styles.css';

function Loading({ role }) {
  return (
    <div className={styles.loading}>
      <div>
        <Spinner invertColor size="large" />
        <h2>{`Loading ${role} interface`}</h2>
        <small>This should just be a moment...</small>
      </div>
    </div>
  );
}

Loading.propTypes = {
  role: PropTypes.string.isRequired,
};

export default Loading;
