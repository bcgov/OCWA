import { connect } from 'react-redux';

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
  console.log(props.data);
  return {};
};

export default withRequest(makeRequest, connect(mapStateToProps)(RequestsList));
