import { connect } from 'react-redux';
import get from 'lodash/get';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import withRequest from '@src/modules/data/containers/request';

import NewRequest from '../components/request-form';
import { changeStep, closeDraftRequest } from '../actions';
import { requestSchema } from '../schemas';

const makeRequest = () => ({
  create: {
    url: 'api/v1/requests',
    schema: { result: requestSchema },
    id: 'create',
  },
  query: 'requests.create',
});

const mapStateToProps = state => {
  const { currentRequestId } = state.requests.viewState;
  const keyPath = `data.entities.requests.${currentRequestId}`;

  return {
    open: !isEmpty(currentRequestId),
    currentStep: state.requests.viewState.currentNewRequestStep,
    isNewRequest: !has(state, keyPath),
    data: get(state, keyPath, {}),
  };
};

export default withRequest(
  makeRequest,
  connect(mapStateToProps, {
    onChangeStep: changeStep,
    onCancel: closeDraftRequest,
  })(NewRequest)
);
