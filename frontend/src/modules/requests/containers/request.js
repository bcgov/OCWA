import { connect } from 'react-redux';
import get from 'lodash/get';
import last from 'lodash/last';
import withRequest from '@src/modules/data/components/data-request';

import { fetchRequest } from '../actions';
import Request from '../components/request';
import { requestsListSchema } from '../schemas';

const mapStateToProps = (state, props) => {
  const { requestId } = props.match.params;
  const data = get(state, `data.entities.requests.${requestId}`, {});
  const chronology = get(data, 'chronology', []);
  const updatedAt = get(last(chronology), 'timestamp', new Date());

  return {
    data,
    updatedAt,
    fetchStatus: get(state, `data.fetchStatus.entities.requests.${requestId}`),
  };
};

export default connect(mapStateToProps)(
  withRequest(Request, {
    initialRequest: ({ requestId }) =>
      fetchRequest({
        url: `/api/v1/requests/${requestId}`,
        schema: requestsListSchema,
        id: requestId,
      }),
  })
);