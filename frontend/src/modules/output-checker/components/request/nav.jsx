import * as React from 'react';
import PropTypes from 'prop-types';
import { CreatableSelect } from '@atlaskit/select';
import { Code } from 'react-content-loader';
import range from 'lodash/range';
import { RequestSchema } from '@src/modules/requests/types';

import RequestCard from '../request-card';
import * as styles from './styles.css';

function RequestsNav({
  activeId,
  data,
  isLoading,
  onStateFilterChange,
  state,
}) {
  const options = [
    {
      label: 'Unclaimed',
      value: 2,
    },
    {
      label: 'In Review',
      value: 3,
    },
    {
      label: 'Approved',
      value: 4,
    },
    {
      label: 'Denied',
      value: 5,
    },
    {
      label: 'Cancelled',
      value: 6,
    },
  ];
  if (isLoading) {
    const elements = range(20);
    return (
      <nav className={styles.nav} style={{ overflowY: 'hidden' }}>
        {elements.map(n => (
          <div key={n} className={styles.loadingListItem}>
            <Code height={60} width={350} />
          </div>
        ))}
      </nav>
    );
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.navHeader}>
        <CreatableSelect
          options={options}
          placeholder="Filter by State"
          value={options.find(d => d.value === state)}
          onChange={({ value }) => onStateFilterChange(value)}
        />
      </div>
      <div className={styles.navScroll}>
        <div>
          {data.map(d => (
            <RequestCard
              key={d._id}
              activeId={activeId}
              data={d}
              draggable={false}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}

RequestsNav.propTypes = {
  activeId: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(RequestSchema).isRequired,
  isLoading: PropTypes.bool.isRequired,
  state: PropTypes.number.isRequired,
  onStateFilterChange: PropTypes.func.isRequired,
};

export default RequestsNav;
