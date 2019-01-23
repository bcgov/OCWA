import { connect } from 'react-redux';
import get from 'lodash/get';
import { fetchRequest } from '@src/modules/requests/actions';
import { requestSchema } from '@src/modules/requests/schemas';
import withRequest from '@src/modules/data/components/data-request';

import Request from '../components/request';

const mapStateToProps = (state, props) => {
  const { requestId } = props.match.params;

  return {
    data: get(state, `data.entities.requests.${requestId}`, {}),
    fetchStatus: get(state, `data.fetchStatus.entities.requests.${requestId}`),
  };
};

export default connect(mapStateToProps, {
  initialRequest: ({ requestId }) =>
    fetchRequest({
      url: `/api/v1/requests/${requestId}`,
      schema: requestSchema,
    }),
})(withRequest(Request));
