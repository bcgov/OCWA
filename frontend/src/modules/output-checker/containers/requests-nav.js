import { connect } from 'react-redux';
import keys from 'lodash/keys';
import withRequest from '@src/modules/data/components/data-request';
import { fetchRequests } from '@src/modules/requests/actions';
import { requestsListSchema } from '@src/modules/requests/schemas';

import RequestNav from '../components/request/nav';

const mapStateToProps = state => {
  const ids = keys(state.data.entities.requests);
  const data = ids.map(id => state.data.entities.requests[id]);

  return {
    data,
  };
};

export default connect(mapStateToProps, {
  initialRequest: () =>
    fetchRequests(
      { page: 1 },
      {
        url: '/api/v1/requests?page=1',
        schema: requestsListSchema,
      }
    ),
})(withRequest(RequestNav));
