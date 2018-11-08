import { connect } from 'react-redux';
import get from 'lodash/get';
import withRequest from '@src/modules/data/components/data-request';

import { fetchRequests, viewDraftRequest } from '../actions';
import RequestsList from '../components/requests-list';
import { requestsListSchema } from '../schemas';

const mapStateToProps = state => {
  const entities = get(state, 'data.entities.requests', {});
  const ids = Object.keys(entities);

  return {
    data: ids.map(id => entities[id]),
    fetchStatus: get(state, 'data.fetchStatus.dataTypes.requests'),
  };
};

export default connect(mapStateToProps, {
  onSelect: viewDraftRequest,
  initialRequest: () =>
    fetchRequests({
      url: '/api/v1/requests',
      schema: requestsListSchema,
    }),
})(withRequest(RequestsList));
