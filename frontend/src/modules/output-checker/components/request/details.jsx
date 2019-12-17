import * as React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import has from 'lodash/has';
import { RequestSchema } from '@src/modules/requests/types';
import { uid } from 'react-uid';

import * as styles from './styles.css';

function Details({ data, fields }) {
  return (
    <div id="request-details-container">
      {fields.map(d => (
        <div
          key={uid(d)}
          id={`request-${d.key}-field`}
          className={styles.fieldRow}
        >
          <h6>{d.label}</h6>
          <p id={`request-details-${d.key}-text`}>
            {d.type === 'url' && (
              <a
                href={get(data, d.key)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {get(data, d.key)}
              </a>
            )}
            {d.type !== 'url' && get(data, d.key)}
            {!has(data, d.key) && <em>{`No ${d.name} details given`}</em>}
          </p>
        </div>
      ))}
    </div>
  );
}

Details.propTypes = {
  data: RequestSchema.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Details;
