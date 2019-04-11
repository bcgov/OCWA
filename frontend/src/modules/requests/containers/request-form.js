import { connect } from 'react-redux';
import get from 'lodash/get';
import withRequest from '@src/modules/data/components/data-request';

import NewRequest from '../components/request-form';
import { createRequest, fetchRequest } from '../actions';
import { requestSchema } from '../schemas';

const mapStateToProps = state => ({
  newRequestId: state.requests.newRequestId,
  fetchStatus: get(state, 'data.fetchStatus.postRequests.requests', 'idle'),
});

export default connect(mapStateToProps, {
  onFetch: id =>
    fetchRequest({
      url: `/api/v1/requests/${id}`,
      schema: requestSchema,
      id,
    }),
  onCreate: (payload, meta) =>
    createRequest(payload, meta, {
      url: '/api/v1/requests',
      schema: { result: requestSchema },
    }),
})(withRequest(NewRequest));
