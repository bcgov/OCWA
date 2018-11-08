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

  return {
    currentStep: state.requests.viewState.currentNewRequestStep,
    isNewRequest: !has(state, keyPath),
    data: get(state, keyPath, {}),
    id: currentRequestId,
    open: !isEmpty(currentRequestId),
    fetchStatus: state.data.fetchStatus.dataTypes.requests,
  };
};

export default connect(mapStateToProps, {
  onChangeStep: changeStep,
  onCancel: closeDraftRequest,
})(
  withRequest(NewRequest, {
    create: payload =>
      createRequest(payload, {
        url: 'api/v1/requests',
        schema: { result: requestSchema },
      }),
    save: (payload, { id }) =>
      saveRequest(payload, {
        url: `api/v1/requests/save/${id}`,
        schema: { result: requestSchema },
        id,
      }),
  })
);
