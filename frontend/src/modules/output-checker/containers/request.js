import { connect } from 'react-redux';
import get from 'lodash/get';
import { fetchRequest } from '@src/modules/requests/actions';
import findLast from 'lodash/findLast';
import { requestSchema } from '@src/modules/requests/schemas';
import withRequest from '@src/modules/data/components/data-request';

import Request from '../components/request';

const mapStateToProps = (state, props) => {
  const { requestId } = props.match.params;
  const data = get(state, `data.entities.requests.${requestId}`, {});
  const chronology = get(data, 'chronology', []);
  const lastSubmission = findLast(chronology, d => d.enteredState === 2);
  const submittedAt = lastSubmission && lastSubmission.timestamp;

  return {
    data,
    fetchStatus: get(state, `data.fetchStatus.entities.requests.${requestId}`),
    submittedAt,
  };
};

export default connect(mapStateToProps, {
  initialRequest: ({ requestId }) =>
    fetchRequest({
      url: `/api/v2/requests/${requestId}`,
      schema: requestSchema,
    }),
})(withRequest(Request));
