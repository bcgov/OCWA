import * as React from 'react';
import PropTypes from 'prop-types';
import Button, { ButtonGroup } from '@atlaskit/button';
import { DatePicker } from '@atlaskit/datetime-picker';
import isAfter from 'date-fns/is_after';
import isBefore from 'date-fns/is_before';
import parse from 'date-fns/parse';

import * as styles from './styles.css';

function Filters({
  endDate,
  onDateChange,
  onRequestStateChange,
  requestState,
  startDate,
}) {
  const onChange = key => date => {
    const value = parse(date);

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
      </ButtonGroup>
      <div className={styles.dateRange}>
        <DatePicker
          dateFormat="DD/MM/YYYY"
          onChange={onChange('startDate')}
          spacing="compact"
          value={startDate}
        />
        <div className={styles.dateRangeDivider}>to</div>
        <DatePicker
          dateFormat="DD/MM/YYYY"
          onChange={onChange('endDate')}
          spacing="compact"
          value={endDate}
        />
      </div>
    </div>
  );
}

Filters.propTypes = {
  endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
    .isRequired,
  onDateChange: PropTypes.func.isRequired,
  onRequestStateChange: PropTypes.func.isRequired,
  requestState: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
    .isRequired,
};

export default Filters;
