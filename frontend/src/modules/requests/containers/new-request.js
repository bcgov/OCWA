import { connect } from 'react-redux';
import withRequest from '@src/modules/data/containers/request';

import NewRequest from '../components/new-request';
import { requestSchema } from '../schemas';

const makeRequest = () => ({
  create: {
    url: '/v1',
    schema: requestSchema,
    id: 'create',
  },
  query: 'requests.create',
});

const mapStateToProps = () => ({});

export default withRequest(makeRequest, connect(mapStateToProps)(NewRequest));
