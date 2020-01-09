import * as React from 'react';
import PropTypes from 'prop-types';
import { RequestSchema } from '@src/modules/requests/types';
import { uid } from 'react-uid';

import * as styles from './styles.css';

function Details({ data, fetchForm, fields }) {
  React.useEffect(() => {
    if (data.formName && fields.length <= 0) {
      fetchForm({ id: data.formName });
    }
  }, [data]);

  return (
    <React.Fragment>
      <header className={styles.chronologyHeader}>
        <h4>Request Details</h4>
      </header>
      <div className={styles.details}>
        <dl>
          {fields
            .filter(d => d.key !== 'name')
            .map(d => (
              <React.Fragment key={uid(d)}>
                <dt>{d.label}</dt>
                <dd id={`request-details-${d.key}-text`}>
                  {data[d.key] || '-'}
                </dd>
              </React.Fragment>
            ))}
        </dl>
      </div>
    </React.Fragment>
  );
}

Details.propTypes = {
  data: RequestSchema.isRequired,
  fetchForm: PropTypes.func.isRequired,
  fields: PropTypes.array.isRequired,
};

export default Details;
