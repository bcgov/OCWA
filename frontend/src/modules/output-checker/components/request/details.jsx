import * as React from 'react';
import forIn from 'lodash/forIn';
import pick from 'lodash/pick';
import startCase from 'lodash/startCase';

import { RequestSchema } from '@src/modules/requests/types';
import * as styles from './styles.css';

const keys = [
  'purpose',
  'confidentiality',
  'freq',
  'selectionCriteria',
  'steps',
  'variableDescriptions',
];
function Details({ data }) {
  const detailValues = pick(data, keys);
  const items = [];

  forIn(detailValues, (value, key) => {
    const titleText = startCase(key);
    items.push(
      <div key={key} className={styles.detailsRow}>
        <h6>{titleText}</h6>
        <p id={`request-details-${key}-text`}>
          {value || <em>{`No ${titleText} details given`}</em>}
        </p>
      </div>
    );
  });

  return <div id="request-details-container">{items}</div>;
}

Details.propTypes = {
  data: RequestSchema.isRequired,
};

export default Details;
