import * as React from 'react';
import PropTypes from 'prop-types';
import Spinner from '@atlaskit/spinner';

import * as styles from './styles.css';

function RequestTypes({ children, data, isLoaded, isLoading }) {
  if (isLoaded) {
    // Pass the data down as params so it can be used to make the subsequent
    // downloads requests (import or export)
    return React.cloneElement(children, { params: { requestTypes: data } });
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Spinner size="large" />
      </div>
    );
  }

  return null;
}

RequestTypes.propTypes = {
  children: PropTypes.node.isRequired,
  data: PropTypes.shape({
    import: PropTypes.string,
    export: PropTypes.string,
  }),
  isLoaded: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

RequestTypes.defaultProps = {
  data: {},
};

export default RequestTypes;
