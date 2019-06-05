import * as React from 'react';
import PropTypes from 'prop-types';
import Button, { ButtonGroup } from '@atlaskit/button';
import { DatePicker } from '@atlaskit/datetime-picker';
import isAfter from 'date-fns/is_after';
import isBefore from 'date-fns/is_before';

import * as styles from './styles.css';

function Filters({
  endDate,
  onDateChange,
  onRequestStateChange,
  requestState,
  startDate,
}) {
  const onChange = key => date => {
    const value = new Date(date);
    if (key === 'endDate') {
      if (isBefore(value, startDate)) return;
    } else if (key === 'startDate') {
      if (isAfter(value, endDate)) return;
    }

    onDateChange(key, value);
  };

  return (
    <div className={styles.filters}>
      <ButtonGroup>
        <Button
          appearance={requestState === 'all' && 'primary'}
          onClick={() => onRequestStateChange('all')}
        >
          All
        </Button>
        <Button
          appearance={requestState === 4 && 'primary'}
          onClick={() => onRequestStateChange(4)}
        >
          Approved
        </Button>
        <Button
          appearance={requestState === 5 && 'primary'}
          onClick={() => onRequestStateChange(5)}
        >
          Rejected
        </Button>
      </ButtonGroup>
      <div className={styles.dateRange}>
        <DatePicker
          onChange={onChange('startDate')}
          spacing="compact"
          value={startDate}
        />
        <div className={styles.dateRangeDivider}>to</div>
        <DatePicker
          onChange={onChange('endDate')}
          spacing="compact"
          value={endDate}
        />
      </div>
    </div>
  );
}

Filters.propTypes = {
  endDate: PropTypes.string.isRequired,
  onDateChange: PropTypes.func.isRequired,
  onRequestStateChange: PropTypes.func.isRequired,
  requestState: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  startDate: PropTypes.string.isRequired,
};

export default Filters;
