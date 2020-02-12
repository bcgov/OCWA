import * as React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import { RequestSchema } from '../../types';
import * as styles from './styles.css';

function getText(data, request) {
  const value = get(request, data.key);

  switch (data.inputType) {
    case 'checkbox':
      return <div>{value ? 'Yes' : 'No'}</div>;

    case 'radio':
      return data.values.find(d => d.value === value).label;

    default:
      return value || '-';
  }
}

function DetailsRow({ data, request }) {
  const { key, label } = data;
  const text = getText(data, request);
  return (
    <div id={`request-${key}-field`} className={styles.fieldRow}>
      <h6>{label}</h6>
      <p id={`request-${key}-text`}>{text}</p>
    </div>
  );
}

DetailsRow.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string,
    key: PropTypes.string,
  }).isRequired,
  request: RequestSchema.isRequired,
};

export default DetailsRow;
