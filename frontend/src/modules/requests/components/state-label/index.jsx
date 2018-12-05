import * as React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import RequestIcon from '../request-icon';
import { getRequestStateColor } from '../../utils';
import * as styles from './styles.css';

function StateLabel({ value }) {
  let name = null;

  switch (value) {
    case 0:
      name = 'Draft';
      break;
    case 1:
      name = 'WIP';
      break;
    case 2:
      name = 'Awaiting Review';
      break;
    case 3:
      name = 'In Review';
      break;
    case 4:
      name = 'Approved';
      break;
    case 5:
      name = 'Errors, needs revision';
      break;
    case 6:
      name = 'Cancelled';
      break;
    default:
      name = 'No state';
      break;
  }

  return (
    <div
      className={cx('request-state-label', styles.container)}
      style={{ backgroundColor: getRequestStateColor(value) }}
    >
      <RequestIcon color="white" size="medium" value={value} />
      {name}
    </div>
  );
}

StateLabel.propTypes = {
  value: PropTypes.number,
};

StateLabel.defaultProps = {
  value: 0,
};

export default StateLabel;
