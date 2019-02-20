import { connect } from 'react-redux';
import forIn from 'lodash/forIn';
import get from 'lodash/get';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';
import union from 'lodash/union';
import values from 'lodash/values';
import withRequest from '@src/modules/data/components/data-request';

import NewRequest from '../components/request-form';
import {
  createRequest,
  changeStep,
  closeDraftRequest,
  reset,
  saveRequest,
} from '../actions';
import { requestSchema } from '../schemas';

const mapStateToProps = state => {
  const { currentRequestId, filesToDelete } = state.requests.viewState;
  const filesForUpload = state.requests.files;
  const filesUploadState = state.requests.uploads;
  const keyPath = `data.entities.requests.${currentRequestId}`;
  const isNewRequest = !has(state, keyPath);
  const request = get(state, keyPath, {
    files: [],
    supportingFiles: [],
  });

  // Files (saved and current editing session files, uploaded or removed)
  const queuedFiles = [];
  const queuedSupportingFiles = [];
  forIn(filesForUpload, (value, key) => {
    if (filesUploadState[key] === 'loaded') {
      queuedFiles.push(key);
    }
  });
  forIn(state.requests.supportingFiles, (value, key) => {
    if (filesUploadState[key] === 'loaded') {
      queuedSupportingFiles.push(key);
    }
  });
  const files = union(request.files, queuedFiles).filter(
    id => !filesToDelete.includes(id)
  );
  const supportingFiles = union(
    request.supportingFiles,
    queuedSupportingFiles
  ).filter(id => !filesToDelete.includes(id));
  // Determine uploading state
  const totalFilesInQueue = values(filesForUpload).length;
  const uploadStates = values(filesUploadState);
  const isUploading =
    uploadStates.length < totalFilesInQueue ||
    uploadStates.some(d => d !== 'loaded');
  const data = {
    ...request,
    files,
    supportingFiles,
  };

  return {
    currentStep: state.requests.viewState.currentNewRequestStep,
    isNewRequest,
    data,
    queuedFiles,
    queuedSupportingFiles,
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
      url: '/api/v1/requests',
      schema: { result: requestSchema },
    }),
  onSave: (payload, meta) =>
    saveRequest(payload, meta, {
      url: `/api/v1/requests/save/${meta.id}`,
      schema: { result: requestSchema },
    }),
  onSubmit: (payload, meta) =>
    saveRequest(payload, meta, {
      url: `/api/v1/requests/submit/${meta.id}`,
      schema: { result: requestSchema },
    }),
  onReset: reset,
})(withRequest(NewRequest));
