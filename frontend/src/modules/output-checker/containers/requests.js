import { connect } from 'react-redux';
import get from 'lodash/get';
import values from 'lodash/values';
import withRequest from '@src/modules/data/components/data-request';
import { fetchRequests } from '@src/modules/requests/actions';
import { requestsListSchema } from '@src/modules/requests/schemas';

import RequestsList from '../components/requests-list';

const mapStateToProps = (state, { params, unassigned }) => {
  const requests = values(state.data.entities.requests);
  const data = requests.filter(d => {
    let showUnassigned = false;
    if (unassigned) {
      bb;
    }

    return d.state === params.state && showUnassigned;
  });

  return {
    data,
    fetchStatus: get(state, 'data.fetchStatus.dataTypes.requests'),
  };
};

export default connect(mapStateToProps, {
  initialRequest: ({ state }) =>
    fetchRequests(
      { page: 1 },
      {
        url: `/api/v1/requests?page=1&state=${state}`,
        schema: requestsListSchema,
      }
    ),
})(withRequest(RequestsList));
