import { connect } from 'react-redux';

import { deleteRequest, editRequest, saveRequest } from '../actions';
import RequestMenu from '../components/request-menu';
import { requestSchema } from '../schemas';

export default connect(null, {
  onCancel: id =>
    saveRequest(
      null,
      { id, dataType: 'requests', schema: { result: requestSchema } },
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
  onEdit: editRequest,
  onWithdraw: id =>
    saveRequest(
      null,
      { id, dataType: 'requests', schema: { result: requestSchema } },
      {
        url: `/api/v1/requests/withdraw/${id}`,
      }
    ),
  onSubmit: id =>
    saveRequest(
      null,
      { id, dataType: 'requests', schema: { result: requestSchema } },
      {
        url: `/api/v1/requests/submit/${id}`,
      }
    ),
})(RequestMenu);
