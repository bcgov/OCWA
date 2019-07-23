import * as React from 'react';
import PropTypes from 'prop-types';
import ArrowDownCircleIcon from '@atlaskit/icon/glyph/arrow-down-circle';
import ArrowUpCircleIcon from '@atlaskit/icon/glyph/arrow-up-circle';
import { colors } from '@atlaskit/theme';
import { _e } from '@src/utils';

function RequestType({ type }) {
  const icon =
    type === 'export' ? (
      <ArrowUpCircleIcon size="small" primaryColor={colors.DN300} />
    ) : (
      <ArrowDownCircleIcon size="small" primaryColor={colors.DN300} />
    );
  return (
    <strong>
      {icon} {_e('{Request} Request', type)}
    </strong>
  );
}

RequestType.propTypes = {
  type: PropTypes.string.isRequired,
};

export default RequestType;
