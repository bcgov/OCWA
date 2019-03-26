import * as React from 'react';
import PropTypes from 'prop-types';
import Flag, { FlagGroup } from '@atlaskit/flag';
import Spinner from '@atlaskit/spinner';

function Loading({ loading }) {
  const flags = [];

  if (loading) {
    const loadingIcon = () => (
      <div style={{ width: 16, height: 16 }}>
        <Spinner invertColor size="small" />
      </div>
    );
    flags.push(
      <Flag
        appearance="info"
        icon={loadingIcon()}
        id="loading"
        key="loading"
        title="Loading..."
      />
    );
  }

  return <FlagGroup>{flags}</FlagGroup>;
}

Loading.propTypes = {
  loading: PropTypes.bool.isRequired,
};

export default Loading;
