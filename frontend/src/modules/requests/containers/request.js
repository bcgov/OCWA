import { connect } from 'react-redux';
import get from 'lodash/get';
import last from 'lodash/last';
import withRequest from '@src/modules/data/components/data-request';

import { fetchRequest } from '../actions';
import Request from '../components/request';
import { requestSchema } from '../schemas';

const defaultRequest = {
  chronology: [],
  files: [],
  fileStatus: {},
  reviewers: [],
  supportingFiles: [],
};

const mapStateToProps = (state, props) => {
  const { requestId } = props.match.params;
  const data = get(
    state,
    `data.entities.requests.${requestId}`,
    defaultRequest
  );
  const updatedAt = get(
    last(data.chronology),
    'timestamp',
    new Date().toString()
  );

  return {
    data,
    updatedAt,
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
