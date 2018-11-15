import { connect } from 'react-redux';
import get from 'lodash/get';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';
import keys from 'lodash/keys';
import union from 'lodash/union';
import values from 'lodash/values';
import withRequest from '@src/modules/data/components/data-request';

import NewRequest from '../components/request-form';
import {
  createRequest,
  changeStep,
  closeDraftRequest,
  saveRequest,
  uploadFile,
} from '../actions';
import { requestSchema } from '../schemas';

const mapStateToProps = state => {
  const { currentRequestId } = state.requests.viewState;
  const keyPath = `data.entities.requests.${currentRequestId}`;
  const isNewRequest = !has(state, keyPath);
  const data = get(state, keyPath, {});
  const uploadedFiles = keys(state.requests.uploads).filter(
    d => d === 'loaded'
  );
  const files = union(data.files, uploadedFiles);
  const isUploading = values(state.requests.uploads).some(isNumber);

  return {
    currentStep: state.requests.viewState.currentNewRequestStep,
    isNewRequest,
    data,
    files,
    id: currentRequestId,
    isUploading,
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
  onUploadFile: uploadFile,
})(withRequest(NewRequest));
