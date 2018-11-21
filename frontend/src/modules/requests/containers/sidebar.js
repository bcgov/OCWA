import { connect } from 'react-redux';

import { deleteRequest, viewDraftRequest, saveRequest } from '../actions';
import Sidebar from '../components/request/sidebar';
import { requestSchema } from '../schemas';

export default connect(null, {
  onCancel: id =>
    saveRequest(
      null,
      { id, dataType: 'requests', schema: requestSchema },
      {
        url: `/api/v1/requests/cancel/${id}`,
      }
    ),
  onDelete: id =>
    deleteRequest(
      id,
      { dataType: 'requests' },
      {
        url: `/api/v1/requests/${id}`,
      }
    ),
  onEdit: viewDraftRequest,
  onWithdraw: id =>
    saveRequest(
      null,
      { id, dataType: 'requests', schema: requestSchema },
      {
        url: `/api/v1/requests/withdraw/${id}`,
      }
    ),
  onSubmit: id =>
    saveRequest(
      null,
      { id, dataType: 'requests', schema: requestSchema },
      {
        url: `/api/v1/requests/submit/${id}`,
      }
    ),
})(Sidebar);
