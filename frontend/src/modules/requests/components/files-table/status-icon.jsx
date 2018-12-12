import * as React from 'react';
import PropTypes from 'prop-types';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import get from 'lodash/get';
import RecentIcon from '@atlaskit/icon/glyph/recent';
import { colors } from '@atlaskit/theme';

import { FileStatusSchema } from '../../types';

function StatusIcon({ data }) {
  const latest = get(data, '[0].pass');
  const hasError = data.some(d => d.error);

  if (!latest || hasError) {
    return <ErrorIcon primaryColor={colors.R500} />;
  }

  if (data.length === 0) {
    return <RecentIcon primaryColor={colors.N70} />;
  }

  return <CheckCircleIcon primaryColor={colors.G500} />;
}

StatusIcon.propTypes = {
  data: PropTypes.arrayOf(FileStatusSchema),
};

StatusIcon.defaultProps = {
  data: [],
};

export default StatusIcon;
