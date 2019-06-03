import * as React from 'react';
import PropTypes from 'prop-types';
import Button, { ButtonGroup } from '@atlaskit/button';
import { DatePicker } from '@atlaskit/datetime-picker';

import * as styles from './styles.css';

function Filters() {
  return (
    <div className={styles.filters}>
      <ButtonGroup>
        <Button appearance="primary">All</Button>
        <Button>Approved</Button>
        <Button>Rejected</Button>
      </ButtonGroup>
      <div className={styles.dateRange}>
        <DatePicker
          spacing="compact"
          value={new Date().setMonth(new Date().getMonth() - 6)}
        />
        <div className={styles.dateRangeDivider}>to</div>
        <DatePicker spacing="compact" value={new Date()} />
      </div>
    </div>
  );
}

export default Filters;
