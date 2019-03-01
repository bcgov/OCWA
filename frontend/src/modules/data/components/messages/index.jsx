import * as React from 'react';
import PropTypes from 'prop-types';
import { colors } from '@atlaskit/theme';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import Flag, { FlagGroup } from '@atlaskit/flag';
import Tick from '@atlaskit/icon/glyph/check-circle';
import get from 'lodash/get';
import startCase from 'lodash/startCase';

const dictionary = {
  failed: 'error',
  success: 'success',
};
const icons = {
  failed: <ErrorIcon label="Error" primaryColor={colors.R400} />,
  success: <Tick label="Success" primaryColor={colors.G400} />,
};

function Messages({ data, onDismiss }) {
  return (
    <FlagGroup onDismissed={onDismiss}>
      {data.map(d => (
        <Flag
          id={d.id}
          key={d.id}
          icon={icons[d.type]}
          description={d.message}
          title={startCase(get(dictionary, d.type))}
        />
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
  onDismiss: PropTypes.func.isRequired,
};

export default Messages;
