import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { deleteRequest, saveRequest } from '../actions';
import RequestMenu from '../components/request-menu';
import { requestSchema } from '../schemas';

export default withRouter(
  connect(null, {
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
  })(RequestMenu)
);
