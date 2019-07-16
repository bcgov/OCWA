import * as React from 'react';
import ArrowDownCircleIcon from '@atlaskit/icon/glyph/arrow-down-circle';
import ArrowUpCircleIcon from '@atlaskit/icon/glyph/arrow-up-circle';
import { zone } from '@src/services/config';
import { colors } from '@atlaskit/theme';
import { _e } from '@src/utils';

function RequestType() {
  const icon =
    zone === 'internal' ? (
      <ArrowUpCircleIcon size="small" primaryColor={colors.DN300} />
    ) : (
      <ArrowDownCircleIcon size="small" primaryColor={colors.DN300} />
    );
  return (
    <strong>
      {icon} {_e('{Request} Request')}
    </strong>
  );
}

export default RequestType;
