import * as React from 'react';
import PropTypes from 'prop-types';
import Spinner from '@atlaskit/spinner';

import * as styles from './styles.css';

function Loading({ text }) {
  return (
    <div className={styles.splashContainer}>
      <div>
        <Spinner invertColor size="large" />
        <h2>{text}</h2>
        <small>This should just be a moment...</small>
      </div>
    </div>
  );
}

Loading.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Loading;
