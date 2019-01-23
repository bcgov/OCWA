import * as React from 'react';
import PropTypes from 'prop-types';
import { Code } from 'react-content-loader';
import range from 'lodash/range';
import { RequestSchema } from '@src/modules/requests/types';

import RequestCard from '../request-card';
import * as styles from './styles.css';

function RequestsNav({ activeId, data, isLoaded, isLoading }) {
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
      {data.map(d => (
        <RequestCard
          key={d._id}
          activeId={activeId}
          data={d}
          draggable={false}
        />
      ))}
    </nav>
  );
}

RequestsNav.propTypes = {
  activeId: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(RequestSchema).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default RequestsNav;
