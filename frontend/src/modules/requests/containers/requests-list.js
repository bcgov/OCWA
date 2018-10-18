import { connect } from 'react-redux';
import get from 'lodash/get';

import RequestsList from '../components/requests-list';
import withRequest from '@src/modules/data/containers/request';
import { requestsListSchema } from '../schemas';

const makeRequest = () => ({
  get: {
    url: '/v1',
    schema: requestsListSchema,
    id: 'requests',
  },
  query: 'requests.requests',
});

const mapStateToProps = (state, props) => {
  const entities = get(state, 'data.entities.requests', {});
  const ids = Object.keys(entities);

  return {
    data: ids.map(id => entities[id]),
  };
};

export default withRequest(makeRequest, connect(mapStateToProps)(RequestsList));
