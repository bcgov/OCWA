import * as React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { CreatableSelect } from '@atlaskit/select';
import { Code } from 'react-content-loader';
import isEmpty from 'lodash/isEmpty';
import range from 'lodash/range';
import { SpotlightTarget } from '@atlaskit/onboarding';
import { RequestSchema } from '@src/modules/requests/types';

import Search from '../search';
import RequestCard from '../request-card';
import * as styles from './styles.css';

function RequestsNav({
  activeId,
  data,
  isLoading,
  onSearch,
  onStateFilterChange,
  state,
}) {
  const options = [
    {
      label: 'Available',
      value: 2,
    },
    {
      label: 'In Review',
      value: 3,
    },
  ];
  const elements = range(20);
  const isLoadingVisible = isLoading && isEmpty(data);

  return (
    <nav
      className={cx(styles.nav, { [styles.navLoading]: isLoadingVisible })}
      style={{ overflowY: isLoadingVisible ? 'hidden' : null }}
    >
      <SpotlightTarget name="requests-filters">
        <div className={styles.navHeader}>
          <div className={styles.navHeaderSearch}>
            <Search placeholder="Filter by Name" onChange={onSearch} />
          </div>
          <CreatableSelect
            id="request-nav-filter-select"
            options={options}
            placeholder="Filter"
            value={options.find(d => d.value === state) || options[0]}
            onChange={({ value }) => onStateFilterChange(value)}
          />
        </div>
      </SpotlightTarget>
      {isLoadingVisible &&
        elements.map(n => (
          <div key={n} className={styles.loadingListItem}>
            <Code height={60} width={350} />
          </div>
        ))}
      {!isLoadingVisible && (
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
      )}
    </nav>
  );
}

RequestsNav.propTypes = {
  activeId: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(RequestSchema).isRequired,
  isLoading: PropTypes.bool.isRequired,
  state: PropTypes.number.isRequired,
  onSearch: PropTypes.func.isRequired,
  onStateFilterChange: PropTypes.func.isRequired,
};

export default RequestsNav;
