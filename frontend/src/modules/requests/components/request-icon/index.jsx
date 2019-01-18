import * as React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@atlaskit/tooltip';
// Icons
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import EditIcon from '@atlaskit/icon/glyph/edit';
import EditFilledIcon from '@atlaskit/icon/glyph/edit-filled';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import RecentIcon from '@atlaskit/icon/glyph/recent';
import WatchFilledIcon from '@atlaskit/icon/glyph/watch-filled';
import MoreIcon from '@atlaskit/icon/glyph/more';

import { getRequestStateColor } from '../../utils';

function RequestIcon({ color, size, value }) {
  let Icon = null;
  let name = null;

  switch (value) {
    case 0:
      Icon = EditIcon;
      name = 'Draft';
      break;
    case 1:
      Icon = EditFilledIcon;
      name = 'Work in Progress';
      break;
    case 2:
      Icon = RecentIcon;
      name = 'Awaiting Review';
      break;
    case 3:
      Icon = WatchFilledIcon;
      name = 'In Review';
      break;
    case 4:
      Icon = CheckCircleIcon;
      name = 'Approved';
      break;
    case 5:
      Icon = ErrorIcon;
      name = 'Errors, needs revision';
      break;
    case 6:
      Icon = CrossIcon;
      name = 'Cancelled';
      break;
    default:
      Icon = MoreIcon;
      name = 'No state';
      break;
  }

  return (
    <Tooltip content={name}>
      <Icon
        label={name}
        primaryColor={color || getRequestStateColor(value)}
        size={size}
      />
    </Tooltip>
  );
}

RequestIcon.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  value: PropTypes.number,
};

RequestIcon.defaultProps = {
  color: null,
  value: 0,
  size: 'small',
};

export default RequestIcon;
