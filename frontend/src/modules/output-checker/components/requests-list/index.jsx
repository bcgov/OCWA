import * as React from 'react';
import PropTypes from 'prop-types';
import { RequestSchema } from '@src/modules/requests/types';

import * as styles from './styles.css';
import Card from '../request-card';

function RequestsList({ data }) {
  return (
    <div className={styles.container}>
      <div>{data.map(d => <Card key={d._id} data={d} />)}</div>
    </div>
  );
}

RequestsList.propTypes = {
  data: PropTypes.arrayOf(RequestSchema).isRequired,
};

export default RequestsList;
