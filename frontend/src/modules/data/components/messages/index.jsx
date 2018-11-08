import * as React from 'react';
import PropTypes from 'prop-types';
import Flag, { FlagGroup } from '@atlaskit/flag';
import get from 'lodash/get';

const getAppearance = type => {
  const dictionary = {
    failed: 'error',
    success: 'success',
  };

  return get(dictionary, type, 'normal');
};

function Messages({ data }) {
  return (
    <FlagGroup>
      {data.map(d => (
        <Flag key={d.id} appearance={getAppearance(d.type)} title={d.message} />
      ))}
    </FlagGroup>
  );
}

Messages.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Messages;
