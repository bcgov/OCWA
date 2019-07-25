import * as React from 'react';
import get from 'lodash/get';
import { RequestSchema } from '@src/modules/requests/types';
import { requestFields } from '@src/modules/requests/utils';
import { uid } from 'react-uid';
import { zone } from '@src/services/config';

import * as styles from './styles.css';

function Details({ data }) {
  const exportType = get(data, 'exportType', 'data');
  const fields = requestFields(data.type).filter(
    d =>
      (d.exportType === 'all' || d.exportType === exportType) &&
      (d.zone === 'all' || d.zone === zone),
  );
  const items = fields.map(d => (
    <div key={uid(d)} className={styles.detailsRow}>
      <h6>{d.name}</h6>
      <p id={`request-details-${d.value}-text`}>
        {d.type === 'url' && (
          <a
            href={get(data, d.value)}
            target="_blank"
            rel="noopener noreferrer"
          >
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
