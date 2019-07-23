import * as React from 'react';
import PropTypes from 'prop-types';
import ArrowDownCircleIcon from '@atlaskit/icon/glyph/arrow-down-circle';
import ArrowUpCircleIcon from '@atlaskit/icon/glyph/arrow-up-circle';
import { colors } from '@atlaskit/theme';
import { _e } from '@src/utils';

function RequestType({ hideText, type }) {
  const label = _e('{Request} Request', type);
  const icon =
    type === 'export' ? (
      <ArrowUpCircleIcon
        size="small"
        primaryColor={colors.DN300}
        label={label}
        title={label}
      />
    ) : (
      <ArrowDownCircleIcon
        size="small"
        primaryColor={colors.DN300}
        label={label}
        title={label}
      />
    );

  if (hideText) {
    return icon;
  }

  return (
    <strong>
      {icon} {_e('{Request} Request', type)}
    </strong>
  );
}

RequestType.propTypes = {
  hideText: PropTypes.bool,
  type: PropTypes.string.isRequired,
};

RequestType.defaultProps = {
  hideText: false,
};

export default RequestType;
