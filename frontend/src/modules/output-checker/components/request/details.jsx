import * as React from 'react';
import forIn from 'lodash/forIn';
import get from 'lodash/get';
import { RequestSchema } from '@src/modules/requests/types';
import { requestFields } from '@src/modules/requests/utils';
import { uid } from 'react-uid';

import * as styles from './styles.css';

function Details({ data }) {
  const fields = requestFields.filter(d => {
    if (d.exportType === 'all') {
      return true;
    }

    if (!data.exportType) {
      return d.exportType !== 'code';
    }

    return d.exportType === data.exportType;
  });
  const items = fields.map(d => (
    <div key={uid(d)} className={styles.detailsRow}>
      <h6>{d.name}</h6>
      <p id={`request-details-${d.value}-text`}>
        {d.type === 'url' && (
          <a href={get(data, d.value)} target="_blank">
            {get(data, d.value)}
          </a>
        )}
        {d.type !== 'url' && get(data, d.value)}
        {!get(data, d.value) && <em>{`No ${d.name} details given`}</em>}
      </p>
    </div>
  ));

  return <div id="request-details-container">{items}</div>;
}

Details.propTypes = {
  data: RequestSchema.isRequired,
};

export default Details;
