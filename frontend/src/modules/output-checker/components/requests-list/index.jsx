import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button'
import { RequestSchema } from '@src/modules/requests/types';

import * as styles from './styles.css';
import Card from '../request-card';

function RequestsList({ data, fetchRequests,page, params }) {
  return (
    <div className={styles.container}>
      <div>{data.map(d => <Card key={d._id} data={d} />)}</div>
      {data.length > 0 && data.length % 100 === 0 && (
        <footer className={styles.footer}>
          <Button 
            id={`load-more-requests-${params.state}`} 
            onClick={() => fetchRequests({ ...params, page: page + 1 })}
          >
            Load More
          </Button>
        </footer> 
      )}
    </div>
  );
}

RequestsList.propTypes = {
  data: PropTypes.arrayOf(RequestSchema).isRequired,
  fetchRequests: PropTypes.func.isRequired, 
  page: PropTypes.number.isRequired,
  params: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    state: PropTypes.number
  }).isRequired
};

export default RequestsList;
