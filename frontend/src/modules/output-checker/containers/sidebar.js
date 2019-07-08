import { connect } from 'react-redux';
import get from 'lodash/get';
import { requestSchema } from '@src/modules/requests/schemas';

import { pickupRequest } from '../actions';
import Sidebar from '../components/request/sidebar';

const mapStateToProps = state => ({
  user: get(state, 'app.auth.user', {}),
  isApprovingRequest: state.outputChecker.viewState.isApprovingRequest,
});

export default connect(mapStateToProps, {
  onApproveRequest: id =>
    pickupRequest(
      null,
      {
        id,
        dataType: 'requests',
        schema: { result: requestSchema },
        isApproval: true,
      },
      {
        url: `/api/v1/requests/approve/${id}`,
      }
    ),
  onDenyRequest: id =>
    pickupRequest(
      null,
      { id, dataType: 'requests', schema: { result: requestSchema } },
      {
        url: `/api/v1/requests/deny/${id}`,
      }
    ),
  onPickupRequest: id =>
    pickupRequest(
      null,
      { id, dataType: 'requests', schema: { result: requestSchema } },
      {
        url: `/api/v1/requests/pickup/${id}`,
      }
    ),
  onRequestRevisions: id =>
    pickupRequest(
      null,
      { id, dataType: 'requests', schema: { result: requestSchema } },
      {
        url: `/api/v1/requests/requestRevisions/${id}`,
      }
    ),
})(Sidebar);
