import { connect } from 'react-redux';
import get from 'lodash/get';

import {
  deleteRequest,
  duplicateRequest,
  viewDraftRequest,
  saveRequest,
} from '../actions';
import Sidebar from '../components/request/sidebar';
import { requestSchema } from '../schemas';

const mapStateToProps = (state, props) => {
  const fetchStatus = get(
    state,
    `data.fetchStatus.entities.requests.${props.data._id}`,
    'idle'
  );
  const isSaving = fetchStatus === 'saving';

  return {
    fetchStatus,
    isSaving,
  };
};

export default connect(mapStateToProps, {
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
  onDuplicate: duplicateRequest,
  onEdit: viewDraftRequest,
  onWithdraw: id =>
    saveRequest(
      null,
      {
        id,
        dataType: 'requests',
        schema: { result: requestSchema },
        isWithdrawing: true,
      },
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
})(Sidebar);
