import { connect } from 'react-redux';
import get from 'lodash/get';
import withRequestTest from '@src/modules/data/components/data-request/test';

import { fetchRequests } from '../actions';
import Request from '../components/request';
import { requestSchema } from '../schemas';

const makeRequest = () => ({
  get: {
    url: '/api/v1/requests',
    schema: requestsListSchema,
    id: 'requests',
  },
  query: 'requests.requests',
  showLoading: false,
});

const mapStateToProps = (state, props) => {
  const data = get(
    state,
    `data.entities.requests.${props.match.requestId}`,
    {}
  );

  return {
    data,
  };
};
export default connect(mapStateToProps)(
  withRequestTest(Request, {
    initialData: params =>
      fetchRequests({
        payload: {
          url: `/api/v1/requests/${params.requestId}`,
          schema: {
            result: requestSchema,
          },
        },
      }),
  })
);
