import { connect } from 'react-redux';
import get from 'lodash/get';
import withRequest from '@src/modules/data/components/data-request';
import { fetchRequest } from '@src/modules/requests/actions';
import { requestSchema } from '@src/modules/requests/schemas';

import Request from '../components/request';
import { makeRequest } from './selectors';

const defaultRequest = {
  chronology: [],
  files: [],
  fileStatus: {},
  reviewers: [],
  supportingFiles: [],
};

const mapStateToProps = (state, props) => {
  const { requestId } = props.match.params;
  const request = get(
    state,
    `data.entities.requests.${requestId}`,
    defaultRequest
  );

  return {
    data: makeRequest(request),
    fetchStatus: get(state, `data.fetchStatus.entities.requests.${requestId}`),
  };
};

export default connect(mapStateToProps, {
  initialRequest: ({ requestId }) =>
    fetchRequest({
      url: `/api/v1/requests/${requestId}`,
      schema: requestSchema,
      id: requestId,
    }),
})(withRequest(Request));
