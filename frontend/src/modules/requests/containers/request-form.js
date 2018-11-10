import { connect } from 'react-redux';
import get from 'lodash/get';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import withRequest from '@src/modules/data/components/data-request';

import NewRequest from '../components/request-form';
import {
  createRequest,
  changeStep,
  closeDraftRequest,
  saveRequest,
} from '../actions';
import { requestSchema } from '../schemas';

const mapStateToProps = state => {
  const { currentRequestId } = state.requests.viewState;
  const keyPath = `data.entities.requests.${currentRequestId}`;
  const isNewRequest = !has(state, keyPath);

  return {
    currentStep: state.requests.viewState.currentNewRequestStep,
    isNewRequest,
    data: get(state, keyPath, {}),
    id: currentRequestId,
    open: !isEmpty(currentRequestId),
    fetchStatus: isNewRequest
      ? state.data.fetchStatus.postRequests.requests
      : state.data.fetchStatus.entities.requests[currentRequestId],
  };
};

export default connect(mapStateToProps, {
  onChangeStep: changeStep,
  onCancel: closeDraftRequest,
  onCreate: (payload, meta) =>
    createRequest(payload, meta, {
      url: 'api/v1/requests',
      schema: { result: requestSchema },
    }),
  onSave: (payload, meta) =>
    saveRequest(payload, meta, {
      url: `api/v1/requests/save/${meta.id}`,
      schema: { result: requestSchema },
    }),
  onSubmit: (payload, meta) =>
    saveRequest(payload, meta, {
      url: `api/v1/requests/submit/${meta.id}`,
      schema: { result: requestSchema },
    }),
})(withRequest(NewRequest));
