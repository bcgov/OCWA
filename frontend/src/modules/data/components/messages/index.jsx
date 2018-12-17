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
  failed: <ErrorIcon label="Error" secondaryColor={colors.R400} />,
  success: <Tick label="Success" secondaryColor={colors.G400} />,
};
const getAppearance = type => get(dictionary, type, 'normal');

function Messages({ data }) {
  return (
    <FlagGroup>
      {data.map(d => (
        <Flag
          id={d.id}
          key={d.id}
          appearance={getAppearance(d.type)}
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
};

export default Messages;
